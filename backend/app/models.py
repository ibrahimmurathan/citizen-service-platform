import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Enum, DateTime, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship


class ComplaintCategory(str, enum.Enum):
    YOL_ALTYAPI = "yol_altyapi"
    CEVRE_ATIK = "cevre_atik"
    KENT_ESTETIK = "kent_estetik"
    ULASIM_TRAFIK = "ulasim_trafik"
    YAPI_IMAR = "yapi_imar"


class ComplaintStatus(str, enum.Enum):
    BEKLEMEDE = "beklemede"
    INCELENIYOR = "inceleniyor"
    REDDEDILDI = "reddedildi"
    COZULDU = "cozuldu"

class TransferStatus(str, enum.Enum):
    BEKLEMEDE = "beklemede"
    ONAYLANDI = "onaylandi"
    REDDEDILDI = "reddedildi"


class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String, unique=True, index=True)
    image_path = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")
    description = Column(Text, nullable=True)
    predicted_category = Column(Enum(ComplaintCategory))
    category = Column(Enum(ComplaintCategory))
    confidence_score = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.BEKLEMEDE)
    created_at = Column(DateTime, default=datetime.utcnow)


class ComplaintTransfer(Base):
    __tablename__ = "complaint_transfers"
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    from_category = Column(Enum(ComplaintCategory))
    to_category = Column(Enum(ComplaintCategory))
    status = Column(Enum(TransferStatus), default=TransferStatus.BEKLEMEDE)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user_full_name = Column(String)
    user_email = Column(String, unique=True, index=True)
    user_phone_number = Column(String)
    user_hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    admin_full_name = Column(String)
    admin_email = Column(String, unique=True, index=True)
    admin_phone_number = Column(String)
    admin_hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    admin_category = Column(Enum(ComplaintCategory))