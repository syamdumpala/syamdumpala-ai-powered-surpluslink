from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Donation(Base):
    __tablename__ = "donations"

    # -------------------------------------
    # Primary Key
    # -------------------------------------
    id = Column(Integer, primary_key=True, index=True)

    # -------------------------------------
    # Basic Donation Info
    # -------------------------------------
    food_name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    expiry_time = Column(DateTime, nullable=False)

    # -------------------------------------
    # Location (For Distance Matching)
    # -------------------------------------
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # -------------------------------------
    # Status Lifecycle
    # -------------------------------------
    status = Column(String, default="available")
    # available → accepted → picked_up → completed → expired

    # -------------------------------------
    # Role Assignments
    # -------------------------------------
    restaurant_id = Column(Integer, ForeignKey("users.id"))
    ngo_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    volunteer_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # -------------------------------------
    # Timestamps
    # -------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # -------------------------------------
    # Relationships
    # -------------------------------------
    restaurant = relationship("User", foreign_keys=[restaurant_id])
    ngo = relationship("User", foreign_keys=[ngo_id])
    volunteer = relationship("User", foreign_keys=[volunteer_id])
