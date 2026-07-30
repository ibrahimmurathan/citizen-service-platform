# backend/create_admin.py
import sys

from app.database import SessionLocal
from app.models import Admin, ComplaintCategory
from app.services.auth_service import hash_password

if len(sys.argv) != 5:
    print("Kullanım: python create_admin.py <ad_soyad> <email> <sifre> <kategori>")
    print("Kategoriler: yol_altyapi, cevre_atik, kent_estetik, ulasim_trafik, yapi_imar")
    sys.exit(1)

full_name, email, password, category = sys.argv[1:5]

db = SessionLocal()

new_admin = Admin(
    admin_full_name=full_name,
    admin_email=email,
    admin_hashed_password=hash_password(password),
    admin_category=ComplaintCategory(category),
)

db.add(new_admin)
db.commit()
db.refresh(new_admin)

print(f"Admin oluşturuldu: {new_admin.admin_full_name} ({new_admin.admin_category.value}), ID: {new_admin.id}")