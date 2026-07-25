import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas
from .. import models
from ..database import get_db
from ..services.prediction_service import get_prediction
from ..models import ComplaintStatus
from ..services.auth_service import get_current_user, get_current_admin

def save_upload_file(contents, filename):
    unique_filename = f"{uuid.uuid4()}.{filename.split('.')[-1]}"
    temp_file_path = f"uploads/{unique_filename}"
    
    os.makedirs("uploads", exist_ok=True)
    
    with open(temp_file_path, "wb") as f:
        f.write(contents)
    
    return temp_file_path

router = APIRouter(prefix="/complaints", tags=["complaints"])
@router.post("", response_model=schemas.ComplaintResponse)

async def create_complaint(
    file: UploadFile = File(...),
    description: str = Form(None),
    latitude: float = Form(...),
    longitude: float = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contents = await file.read()

    predicted_category, confidence_score = get_prediction(contents)

    image_path = save_upload_file(contents, file.filename)

    new_complaint = models.Complaint(
        image_path=image_path,
        user_id=current_user.id,
        description=description,
        latitude=latitude,
        longitude=longitude,
        predicted_category=predicted_category,
        confidence_score=confidence_score,
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return new_complaint

@router.get("", response_model=list[schemas.ComplaintResponse])
def list_complaints(
    status: models.ComplaintStatus = None,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    query = db.query(models.Complaint).filter(
        models.Complaint.predicted_category == current_admin.admin_category
    )
    if status:
        query = query.filter(models.Complaint.status == status)
    return query.all()

@router.get("/{complaint_id}", response_model=schemas.ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı")
    return complaint

@router.patch("/{complaint_id}/status", response_model=schemas.ComplaintResponse)
def update_complaint_status(
    complaint_id: int,
    status_update: schemas.ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı")

    if complaint.predicted_category != current_admin.admin_category:
        raise HTTPException(status_code=403, detail="Bu şikayet üzerinde yetkiniz yok")

    complaint.status = status_update.status
    db.commit()
    db.refresh(complaint)
    return complaint