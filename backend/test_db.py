from app.database import Base, SessionLocal, engine
from app.models import Complaint, ComplaintCategory, ComplaintStatus

Base.metadata.create_all(bind=engine)
db = SessionLocal()

test_complaint = Complaint(
    image_path="test_image.jpg",
    full_name="Test User",
    email="test@email.com",
    phone_number="1234567890",
    description="This is a test complaint.",
    predicted_category=ComplaintCategory.YOL_ALTYAPI,
    confidence_score=0.9,
    latitude=40.7128,
    longitude=-74.0060,
    )
db.add(test_complaint)
db.commit()
db.refresh(test_complaint)

print("Kayıt oluşturuldu, ID:", test_complaint.id)
print("Oluşturulma zamanı:", test_complaint.created_at)

result = db.query(Complaint).filter(Complaint.id == test_complaint.id).first()
print("Geri okunan kayıt:", result.full_name, result.predicted_category)