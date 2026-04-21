from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# -------------------------------------------------
# Create Donation Schema
# -------------------------------------------------
class DonationCreate(BaseModel):
    food_name: str
    quantity: str
    expiry_time: datetime
    latitude: float
    longitude: float


# -------------------------------------------------
# Update Donation Schema (Future Use)
# -------------------------------------------------
class DonationUpdate(BaseModel):
    food_name: Optional[str] = None
    quantity: Optional[str] = None
    expiry_time: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None


# -------------------------------------------------
# Donation Response Schema
# -------------------------------------------------
class DonationResponse(BaseModel):
    id: int
    food_name: str
    quantity: str
    expiry_time: datetime

    latitude: float
    longitude: float

    status: str

    restaurant_id: int
    ngo_id: Optional[int] = None
    volunteer_id: Optional[int] = None

    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
