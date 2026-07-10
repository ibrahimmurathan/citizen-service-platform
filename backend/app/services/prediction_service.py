import random
from ..models import ComplaintCategory

#model burada bir kere yüklenecek ve ilerde fonksiyona bağlı çağrılacak 
#model = None şuan stub olduğu için none bırakıldı

model = None # sonra model = load_model_fromdisk gibi bir fonks. ile çağıralacak 

def get_prediction(image_bytes):
    # burada da model.predict(image_bytes) benzeri bir fonksiyon çağrılacak ve prediction dönecek
    # simdilik test amaçlı stub olarak random değerler döndürüyor
    predicted_category = random.choice(list(ComplaintCategory))
    confidence_score = random.uniform(0.7, 0.95)
    return predicted_category, confidence_score