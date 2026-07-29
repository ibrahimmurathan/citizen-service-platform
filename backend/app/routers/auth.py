from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    if not user_data.tc_kimlik_no.isdigit() or len(user_data.tc_kimlik_no) != 11:
        raise HTTPException(status_code=400, detail="TC Kimlik No 11 haneli ve yalnızca rakamlardan oluşmalıdır")

    existing_user = db.query(models.User).filter(models.User.user_email == user_data.user_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")

    existing_tc = db.query(models.User).filter(models.User.tc_kimlik_no == user_data.tc_kimlik_no).first()
    if existing_tc:
        raise HTTPException(status_code=400, detail="Bu TC Kimlik No zaten kayıtlı")

    new_user = models.User(
        user_full_name=user_data.user_full_name,
        user_email=user_data.user_email,
        user_phone_number=user_data.user_phone_number,
        tc_kimlik_no=user_data.tc_kimlik_no,
        user_hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "role": "user"})
    return {"access_token": token, "role": "user", "full_name": new_user.user_full_name}


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.admin_email == credentials.user_email).first()
    if admin and verify_password(credentials.password, admin.admin_hashed_password):
        token = create_access_token({"sub": str(admin.id), "role": "admin"})
        return {"access_token": token, "role": "admin", "full_name": admin.admin_full_name}

    user = db.query(models.User).filter(models.User.user_email == credentials.user_email).first()
    if user and verify_password(credentials.password, user.user_hashed_password):
        token = create_access_token({"sub": str(user.id), "role": "user"})
        return {"access_token": token, "role": "user", "full_name": user.user_full_name}

    raise HTTPException(status_code=401, detail="Email veya şifre hatalı")