# Belediye Görsel Tabanlı Şehir Sorunu Tespit Sistemi

Vatandaşların şehirdeki altyapı ve çevre sorunlarını fotoğraf çekerek bildirdiği, yapay zeka ile otomatik olarak kategorize eden, konum bilgisiyle haritalandıran ve ilgili belediye biriminin yönetebildiği uçtan uca bir web sistemi.


## İçindekiler

- [Proje Özeti](#proje-özeti)
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Mimari](#mimari)
- [Klasör Yapısı](#klasör-yapısı)
- [Kurulum](#kurulum)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [API Genel Bakış](#api-genel-bakış)
- [Yapay Zeka Modeli](#yapay-zeka-modeli)
- [Bilinen Sınırlamalar ve Gelecek Çalışmalar](#bilinen-sınırlamalar-ve-gelecek-çalışmalar)

## Proje Özeti

Sistem, vatandaşın kategori hakkında hiçbir bilgi girmesine gerek kalmadan çalışır. Kullanıcı yalnızca bir fotoğraf yükler, kısa bir açıklama ve konum ekler; sistem fotoğrafı fine-tune edilmiş bir görüntü sınıflandırma modeliyle analiz ederek beş ana kategoriden birine otomatik olarak atar. Şikayet, bu kategoriden sorumlu belediye biriminin (admin hesabının) panelinde görünür.

Beş kategori, gerçek belediye daire başkanlıklarına karşılık gelecek şekilde tasarlanmıştır:

- Yol ve Altyapı
- Çevre ve Katı Atık
- Kent Estetiği
- Ulaşım ve Trafik
- Yapı ve İmar

## Özellikler

**Vatandaş tarafı**
- Email/şifre ile kayıt ve giriş
- Fotoğraf yükleyerek şikayet oluşturma (kategori seçimi yapılmaz, otomatik atanır)
- Harita üzerinden konum seçme (GPS veya manuel işaretleme)
- Geçmiş başvurularını görüntüleme
- Giriş yapmadan, yalnızca takip numarasıyla şikayet durumu sorgulama

**Admin tarafı**
- Her admin hesabı belirli bir kategoriye bağlıdır ve yalnızca kendi kategorisindeki şikayetleri görür
- Harita üzerinde şikayetlerin konumlarını görüntüleme
- Şikayet detaylarını (fotoğraf, açıklama, güven skoru, başvuru sahibi bilgileri) inceleme
- Şikayet durumunu güncelleme (beklemede, inceleniyor, çözüldü, reddedildi)
- Yanlış kategoriye düşen şikayetleri başka bir birime transfer talebi olarak gönderme
- Gelen transfer taleplerini onaylama veya reddetme
- Şikayetleri silme (arşivleme) ve gerektiğinde geri yükleme
- Aktif, geçmiş ve silinen şikayetlerin ayrı listelenmesi
- Özet istatistik kutucukları (toplam, durum bazlı sayılar)

**Yapay zeka**
- EfficientNet-B0 üzerine transfer learning ile fine-tune edilmiş görüntü sınıflandırma modeli
- Model, Google Colab üzerinde eğitilmiş ve backend içine yerel olarak entegre edilmiştir

## Teknoloji Yığını

**Backend**
- FastAPI
- SQLAlchemy (ORM)
- SQLite (yerel veritabanı, Docker volume ile kalıcı)
- Pydantic (veri doğrulama)
- Passlib + bcrypt (şifre hashleme)
- python-jose (JWT token üretimi ve doğrulama)
- Hugging Face Transformers + PyTorch (model çıkarımı)
- Docker ve Docker Compose

**Frontend**
- React (Vite)
- React Router
- React Leaflet (OpenStreetMap tabanlı harita entegrasyonu)
- Context API ile kimlik doğrulama durumu yönetimi

**Model eğitimi**
- Google Colab (ücretsiz GPU ortamı)
- Hugging Face Transformers (EfficientNet-B0)

## Mimari

Backend, sorumlulukların ayrıldığı katmanlı bir yapı izler:

- `routers/`: HTTP endpoint tanımları, yalnızca istek/cevap akışından sorumludur
- `services/`: iş mantığı (yapay zeka çıkarımı, kimlik doğrulama, dosya işlemleri) burada yaşar
- `models.py`: veritabanı tabloları (SQLAlchemy)
- `schemas.py`: API giriş/çıkış veri şemaları (Pydantic)

Bu ayrım sayesinde, örneğin yapay zeka modelinin değiştirilmesi yalnızca `services/prediction_service.py` dosyasını etkiler; endpoint tanımlarına dokunulmaz.

Admin ve vatandaş kimlik doğrulaması ayrı veritabanı tabloları (`User`, `Admin`) üzerinden yürütülür ancak tek bir birleşik giriş endpoint'i (`/auth/login`) üzerinden yönetilir; sistem, girilen bilgilere göre hangi tabloda eşleşme olduğunu belirleyip buna göre yetkilendirilmiş bir JWT token üretir.

## Klasör Yapısı

```
citizen-service-platform/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── complaints.py
│   │   │   ├── predict.py
│   │   │   └── transfers.py
│   │   └── services/
│   │       ├── auth_service.py
│   │       └── prediction_service.py
│   ├── ml_model/          (fine-tune edilmiş model dosyaları, repoya dahil değildir)
│   ├── uploads/           (yüklenen fotoğraflar)
│   ├── data/               (kalıcı SQLite veritabanı)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── services/
└── docker-compose.yml
```

## Kurulum

### Ön Koşullar

- Docker ve Docker Compose
- Node.js ve npm

### Backend

```bash
cd backend
docker compose up -d --build
```

API, `http://localhost:8000` adresinde çalışır. Otomatik oluşturulan API dokümantasyonuna `http://localhost:8000/docs` adresinden erişilebilir.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Uygulama, `http://localhost:5173` adresinde çalışır.

### Admin Hesapları Oluşturma

Sistemde admin kaydı açık bir endpoint üzerinden yapılmaz; adminler komut satırından oluşturulur:

```bash
docker compose exec backend python create_admin.py "<ad soyad>" "<email>" "<şifre>" "<kategori>"
```

Kategori değerleri: `yol_altyapi`, `cevre_atik`, `kent_estetik`, `ulasim_trafik`, `yapi_imar`

## Ortam Değişkenleri

Backend, `backend/.env` dosyasından okunan aşağıdaki değişkeni gerektirir:

```
SECRET_KEY=<rastgele üretilmiş, uzun bir anahtar>
```

Bu dosya versiyon kontrolüne dahil edilmemelidir.

## API Genel Bakış

| Endpoint | Metod | Açıklama |
|---|---|---|
| `/auth/register` | POST | Vatandaş kaydı |
| `/auth/login` | POST | Birleşik giriş (vatandaş veya admin) |
| `/complaints` | POST | Yeni şikayet oluşturma (giriş gerektirir) |
| `/complaints` | GET | Admin'in kendi kategorisindeki şikayetleri listeleme |
| `/complaints/my` | GET | Vatandaşın kendi şikayetlerini listeleme |
| `/complaints/track/{tracking_code}` | GET | Takip numarasıyla sorgulama (girişsiz) |
| `/complaints/{id}/status` | PATCH | Şikayet durumunu güncelleme (admin) |
| `/predict` | POST | Bağımsız model tahmin testi |
| `/transfers/{complaint_id}` | POST | Transfer talebi oluşturma |
| `/transfers/incoming` | GET | Gelen transfer taleplerini listeleme |
| `/transfers/outgoing` | GET | Gönderilen bekleyen talepleri listeleme |
| `/transfers/{id}/respond` | PATCH | Transfer talebini onaylama veya reddetme |

Tüm korumalı endpoint'ler, `Authorization: Bearer <token>` header'ı ile çağrılmalıdır.

## Yapay Zeka Modeli

Model, beş kategoriye ait toplam yaklaşık 1450 görselden oluşan bir veri seti ile, Hugging Face üzerinden alınan önceden eğitilmiş bir EfficientNet-B0 mimarisi üzerine fine-tune edilmiştir. Eğitim, Google Colab üzerinde ücretsiz GPU ile gerçekleştirilmiştir.

Test seti üzerinde ölçülen doğruluk oranı yaklaşık %99'dur. Bu oranın yüksekliği, kategoriler arasındaki görsel farkın belirgin olmasından kaynaklanmaktadır; modelin gerçek dünyadaki daha çeşitli görsellerle test edilerek zamanla iyileştirilmesi planlanmaktadır.

Eğitilen model dosyaları, veritabanı boyutu nedeniyle bu repoya dahil edilmemiştir ve backend içinde `ml_model/` klasöründe yerel olarak barındırılması gerekmektedir.

## Bilinen Sınırlamalar ve Gelecek Çalışmalar

- Frontend şu an yalnızca yerel geliştirme sunucusu (`npm run dev`) ile çalışmaktadır; Docker Compose'a dahil edilmesi planlanmaktadır
- Model, birden fazla sorunun aynı fotoğrafta bulunduğu karışık görsellerde daha düşük doğruluk göstermektedir
- Alt kategori tespiti (örneğin yol ve altyapı kategorisi içinde çukur/kaldırım ayrımı) şu an yapılmamaktadır
- Email veya SMS ile durum bildirimi henüz mevcut değildir
