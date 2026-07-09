import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Enum, DateTime
from .database import Base


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

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column (Integer, primary_key=True, index=True)
    image_path = Column(String)
    full_name = Column (String)
    email = Column (String, nullable=True)
    phone_number = Column (String)
    description = Column(Text, nullable=True)
    predicted_category = Column(Enum(ComplaintCategory))
    confidence_score = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.BEKLEMEDE)
    created_at = Column(DateTime, default=datetime.utcnow)
