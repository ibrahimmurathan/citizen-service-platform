FROM python:3.12.7-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install torch==2.4.1 --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]