from datetime import datetime
from typing  import Optional
from pydantic import BaseModel
from .models import ComplaintCategory, ComplaintStatus

class ComplaintCreate(BaseModel):
    image_path: str
    full_name: str
    email: Optional[str] = None
    phone_number: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    
class ComplaintResponse(BaseModel):
    id: int
    image_path: str
    full_name: str
    email: Optional[str] = None
    phone_number: str
    description: Optional[str] = None
    predicted_category: ComplaintCategory
    confidence_score: float
    latitude: float
    longitude: float
    status: ComplaintStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class ComplaintStatusUpdate(BaseModel):
    status: ComplaintStatus