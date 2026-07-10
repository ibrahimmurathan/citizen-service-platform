from fastapi import FastAPI
from .routers import predict, complaints
from .database import Base, engine
from . import models  # models.py'nin çalışması lazım ki Base'e tablolar "kaydolsun"

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(predict.router)
app.include_router(complaints.router)