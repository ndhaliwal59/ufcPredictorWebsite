# models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSON
from database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationship to events
    events = relationship("Event", back_populates="user", cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships - ADD lazy='joined' for eager loading
    user = relationship("User", back_populates="events")
    matches = relationship("Match", back_populates="event", cascade="all, delete-orphan", lazy='joined')

class Match(Base):
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    fighter1 = Column(String, nullable=False)
    fighter2 = Column(String, nullable=False)
    odds1 = Column(String, nullable=False)
    odds2 = Column(String, nullable=False)
    referee = Column(String, nullable=False)
    event_date = Column(Date, nullable=False)
    result = Column(String, default="pending")  # pending, hit, miss
    prediction_data = Column(JSON, nullable=True)  # Store all prediction details as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    event = relationship("Event", back_populates="matches")
