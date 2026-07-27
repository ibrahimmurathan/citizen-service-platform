from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..services.auth_service import get_current_admin

router = APIRouter(prefix="/transfers", tags=["transfers"])


@router.post("/{complaint_id}", response_model=schemas.TransferResponse)
def create_transfer(
    complaint_id: int,
    transfer_data: schemas.TransferRequest,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı")

    if complaint.category != current_admin.admin_category:
        raise HTTPException(status_code=403, detail="Bu şikayet üzerinde yetkiniz yok")

    existing_pending = (
        db.query(models.ComplaintTransfer)
        .filter(
            models.ComplaintTransfer.complaint_id == complaint_id,
            models.ComplaintTransfer.status == models.TransferStatus.BEKLEMEDE,
        )
        .first()
    )
    if existing_pending:
        raise HTTPException(status_code=400, detail="Bu şikayet için zaten bekleyen bir transfer talebi var")

    if transfer_data.to_category == current_admin.admin_category:
        raise HTTPException(status_code=400, detail="Şikayet zaten bu kategoride")

    new_transfer = models.ComplaintTransfer(
        complaint_id=complaint_id,
        from_category=current_admin.admin_category,
        to_category=transfer_data.to_category,
    )
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)

    return new_transfer


@router.get("/incoming", response_model=list[schemas.TransferResponse])
def get_incoming_transfers(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    return (
        db.query(models.ComplaintTransfer)
        .filter(
            models.ComplaintTransfer.to_category == current_admin.admin_category,
            models.ComplaintTransfer.status == models.TransferStatus.BEKLEMEDE,
        )
        .order_by(models.ComplaintTransfer.created_at.desc())
        .all()
    )

@router.get("/outgoing", response_model=list[schemas.TransferResponse])
def get_outgoing_transfers(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    return (
        db.query(models.ComplaintTransfer)
        .filter(
            models.ComplaintTransfer.from_category == current_admin.admin_category,
            models.ComplaintTransfer.status == models.TransferStatus.BEKLEMEDE,
        )
        .order_by(models.ComplaintTransfer.created_at.desc())
        .all()
    )


@router.patch("/{transfer_id}/respond", response_model=schemas.TransferResponse)
def respond_to_transfer(
    transfer_id: int,
    response_data: schemas.TransferRespondRequest,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    transfer = db.query(models.ComplaintTransfer).filter(models.ComplaintTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer talebi bulunamadı")

    if transfer.to_category != current_admin.admin_category:
        raise HTTPException(status_code=403, detail="Bu talep üzerinde yetkiniz yok")

    if transfer.status != models.TransferStatus.BEKLEMEDE:
        raise HTTPException(status_code=400, detail="Bu talep zaten sonuçlandırılmış")

    if response_data.approve:
        transfer.status = models.TransferStatus.ONAYLANDI
        complaint = db.query(models.Complaint).filter(models.Complaint.id == transfer.complaint_id).first()
        complaint.category = transfer.to_category
    else:
        transfer.status = models.TransferStatus.REDDEDILDI

    db.commit()
    db.refresh(transfer)

    return transfer