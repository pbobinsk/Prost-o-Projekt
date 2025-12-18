# services/user-service/database.py
import os
from motor.motor_asyncio import AsyncIOMotorClient # <--- ZMIANA: import z motor
from dotenv import load_dotenv

load_dotenv()

# Tworzymy asynchronicznego klienta
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))

# Dostęp do bazy danych (bez zmian)
db = client.user_database

# Dostęp do kolekcji (bez zmian)
user_collection = db["users"]