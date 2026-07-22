from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.user_email == user_data.user_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")

    new_user = models.User(
        user_full_name=user_data.user_full_name,
        user_email=user_data.user_email,
        user_phone_number=user_data.user_phone_number,
        user_hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "role": "user"})
    return {"access_token": token}


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_email == credentials.user_email).first()
    if not user or not verify_password(credentials.password, user.user_hashed_password):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")

    token = create_access_token({"sub": str(user.id), "role": "user"})
    return {"access_token": token}