from fastapi import APIRouter, UploadFile, File
from ..services.prediction_service import get_prediction

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post("")
async def predict_category(file: UploadFile = File(...)):
   image_bytes = await file.read()
   predicted_category, confidence_score = get_prediction(image_bytes)
   return {
         "predicted_category": predicted_category.value,
         "confidence_score": confidence_score
   }
