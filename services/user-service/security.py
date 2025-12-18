# services/user-service/security.py

from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
import bcrypt # Będziemy go używać bezpośrednio

# --- Usunęliśmy import i definicję pwd_context z passlib ---

# Stałe do obsługi JWT (bez zmian)
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# =====================================================================
# NOWA, BEZPOŚREDNIA IMPLEMENTACJA Z UŻYCIEM BCRYPT
# =====================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Weryfikuje hasło (string) z hashem (string)."""
    # bcrypt wymaga enkodowania stringów do formatu bajtowego (utf-8)
    password_bytes = plain_password.encode('utf-8')
    hashed_password_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_password_bytes)

def get_password_hash(password: str) -> str:
    """Haszuje hasło (string) i zwraca hash (jako string)."""
    # bcrypt wymaga enkodowania stringów do formatu bajtowego (utf-8)
    password_bytes = password.encode('utf-8')
    # bcrypt.gensalt() generuje "sól" i konfiguruje algorytm
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    # Zdekoduj hash z powrotem do stringa, aby można go było zapisać w bazie
    return hashed_bytes.decode('utf-8')

# =====================================================================

def create_access_token(data: dict):
    """Tworzy token JWT (bez zmian)."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt