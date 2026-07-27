from fastapi import FastAPI
from .routers import predict, complaints, auth, transfers
from .database import Base, engine
from . import models 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(predict.router)
app.include_router(complaints.router)
app.include_router(auth.router)
app.include_router(transfers.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)