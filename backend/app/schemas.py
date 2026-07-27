from datetime import datetime
from typing  import Optional
from pydantic import BaseModel
from .models import ComplaintCategory, ComplaintStatus, TransferStatus

class UserInfo(BaseModel):
    id: int
    user_full_name: str
    user_email: str
    user_phone_number: str

    class Config:
        from_attributes = True
   
class ComplaintResponse(BaseModel):
    id: int
    tracking_code: str
    image_path: str
    user: UserInfo
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
    
class UserRegister(BaseModel):
    user_full_name: str
    user_email: str
    user_phone_number: str
    password: str

class LoginRequest(BaseModel):
    user_email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name : str

class TransferRequest(BaseModel):
    to_category: ComplaintCategory


class TransferResponse(BaseModel):
    id: int
    complaint_id: int
    from_category: ComplaintCategory
    to_category: ComplaintCategory
    status: TransferStatus
    created_at: datetime

    class Config:
        from_attributes = True


class TransferRespondRequest(BaseModel):
    approve: bool