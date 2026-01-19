# Krok 1: Wybierz oficjalny, lekki obraz Pythona jako bazę
FROM python:3.9-slim

# Krok 2: Ustaw folder roboczy wewnątrz kontenera
WORKDIR /app

# Krok 3: Skopiuj plik z zależnościami
COPY requirements.txt .

# Krok 4: Zainstaluj zależności za pomocą pip
RUN pip install --no-cache-dir -r requirements.txt

# Krok 5: Skopiuj resztę kodu aplikacji
COPY . .

# Krok 6: Komenda, która uruchomi serwer po starcie kontenera
# Uvicorn uruchomi aplikację 'app' z pliku 'app.py'
# --host 0.0.0.0 sprawia, że serwer jest dostępny z zewnątrz kontenera
# --port 8000 to standardowy port dla aplikacji deweloperskich
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]