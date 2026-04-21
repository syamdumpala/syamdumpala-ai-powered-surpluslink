from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, func
from datetime import datetime
import math

from app.database import get_db
from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationResponse
from app.core.dependencies import role_required
from app.models.user import User
from app.core.connection_manager import manager  # ✅ WebSocket manager

router = APIRouter(prefix="/donations", tags=["Donations"])


# -------------------------------------------------
# Utility: Haversine Distance (KM)
# -------------------------------------------------
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# -------------------------------------------------
# Restaurant Creates Donation
# -------------------------------------------------
@router.post("/", response_model=DonationResponse)
async def create_donation(
    donation: DonationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(role_required("restaurant"))
):

    if donation.expiry_time <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Expiry time must be in future")

    new_donation = Donation(
        food_name=donation.food_name,
        quantity=donation.quantity,
        expiry_time=donation.expiry_time,
        latitude=donation.latitude,
        longitude=donation.longitude,
        restaurant_id=user.id,
        status="available"
    )

    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    # 🔔 Real-time NGO notification
    await manager.send_to_role("ngo", {
        "event": "new_donation",
        "id": new_donation.id,
        "food_name": new_donation.food_name,
        "quantity": new_donation.quantity,
        "expiry_time": str(new_donation.expiry_time),
        "latitude": new_donation.latitude,
        "longitude": new_donation.longitude
    })

    return new_donation


# -------------------------------------------------
# NGO View Donations (Smart Expiry + Distance)
# -------------------------------------------------
@router.get("/", response_model=list[DonationResponse])
def get_donations(
    status: str = Query(default="available"),
    sort: str = Query(default="expiry"),
    lat: float = Query(default=None),
    lon: float = Query(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(role_required("ngo"))
):

    # Auto-expire outdated donations
    expired_donations = db.query(Donation).filter(
        Donation.status == "available",
        Donation.expiry_time <= datetime.utcnow()
    ).all()

    for donation in expired_donations:
        donation.status = "expired"

    db.commit()

    query = db.query(Donation).filter(Donation.status == status)

    if sort == "expiry":
        query = query.order_by(asc(Donation.expiry_time))

    donations = query.all()

    # Distance sorting
    if sort == "distance" and lat is not None and lon is not None:
        donations.sort(
            key=lambda d: calculate_distance(lat, lon, d.latitude, d.longitude)
        )

    return donations


# -------------------------------------------------
# NGO Accept Donation
# -------------------------------------------------
@router.put("/{donation_id}/accept")
async def accept_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(role_required("ngo"))
):

    donation = db.query(Donation).filter(Donation.id == donation_id).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    if donation.status != "available":
        raise HTTPException(status_code=400, detail="Donation already processed")

    if donation.expiry_time <= datetime.utcnow():
        donation.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Donation expired")

    donation.status = "accepted"
    donation.ngo_id = user.id
    donation.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(donation)

    # 🔔 Notify Volunteers
    await manager.send_to_role("volunteer", {
        "event": "donation_accepted",
        "donation_id": donation.id
    })

    return {
        "message": "Donation accepted successfully",
        "donation_id": donation.id,
        "status": donation.status
    }


# -------------------------------------------------
# Volunteer Pick Up Donation
# -------------------------------------------------
@router.put("/{donation_id}/pickup")
async def pickup_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(role_required("volunteer"))
):

    donation = db.query(Donation).filter(Donation.id == donation_id).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    if donation.status != "accepted":
        raise HTTPException(status_code=400, detail="Donation not ready for pickup")

    donation.status = "picked_up"
    donation.volunteer_id = user.id
    donation.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(donation)

    return {
        "message": "Donation picked up successfully",
        "donation_id": donation.id,
        "status": donation.status
    }


# -------------------------------------------------
# Volunteer Complete Donation
# -------------------------------------------------
@router.put("/{donation_id}/complete")
async def complete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(role_required("volunteer"))
):

    donation = db.query(Donation).filter(Donation.id == donation_id).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    if donation.status != "picked_up":
        raise HTTPException(status_code=400, detail="Donation not ready for completion")

    donation.status = "completed"
    donation.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(donation)

    # 🔔 Notify Admin
    await manager.send_to_role("admin", {
        "event": "donation_completed",
        "donation_id": donation.id
    })

    return {
        "message": "Donation completed successfully",
        "donation_id": donation.id,
        "status": donation.status
    }


# -------------------------------------------------
# Admin View All Donations
# -------------------------------------------------
@router.get("/admin/all", response_model=list[DonationResponse])
def admin_view_all(
    db: Session = Depends(get_db),
    user: User = Depends(role_required("admin"))
):
    return db.query(Donation).all()


# -------------------------------------------------
# Admin Analytics Dashboard
# -------------------------------------------------
@router.get("/admin/analytics")
def admin_analytics(
    db: Session = Depends(get_db),
    user: User = Depends(role_required("admin"))
):

    total = db.query(func.count(Donation.id)).scalar()
    available = db.query(func.count(Donation.id)).filter(Donation.status == "available").scalar()
    accepted = db.query(func.count(Donation.id)).filter(Donation.status == "accepted").scalar()
    picked_up = db.query(func.count(Donation.id)).filter(Donation.status == "picked_up").scalar()
    completed = db.query(func.count(Donation.id)).filter(Donation.status == "completed").scalar()
    expired = db.query(func.count(Donation.id)).filter(Donation.status == "expired").scalar()

    meals_saved = completed * 10
    co2_saved = round(completed * 2.5, 2)

    return {
        "total_donations": total,
        "available": available,
        "accepted": accepted,
        "picked_up": picked_up,
        "completed": completed,
        "expired": expired,
        "meals_saved_estimate": meals_saved,
        "co2_saved_estimate_kg": co2_saved
    }
