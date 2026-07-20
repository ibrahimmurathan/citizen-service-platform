from fastapi import FastAPI
from .routers import predict, complaints
from .database import Base, engine
from . import models 
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(predict.router)
app.include_router(complaints.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)