import os
import random
import io

import torch
from PIL import Image
from transformers import AutoModelForImageClassification, AutoImageProcessor

from ..models import ComplaintCategory

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "ml_model")

trained_model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)
model_processor = AutoImageProcessor.from_pretrained(MODEL_PATH)

# Model her zaman aynı çıkarım modunda kalsın diye (eğitim moduna geçmesin)
trained_model.eval()


def get_prediction(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    #Processor ile modelin beklediği tensor formatına hazırla
    inputs = model_processor(images=image, return_tensors="pt")

    # Modelden tahmin al
    with torch.no_grad():
        outputs = trained_model(**inputs)

    # Ham skorları olasılığa çevir, en yüksek olanı bul
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    confidence, predicted_id = torch.max(probs, dim=-1)

    # 5. Sayısal id'yi kategori ismine çevir
    predicted_label = trained_model.config.id2label[predicted_id.item()]

    # 6. String kategori ismini, bizim enum'umuza çevir
    predicted_category = ComplaintCategory(predicted_label)
    confidence_score = confidence.item()

    return predicted_category, confidence_score