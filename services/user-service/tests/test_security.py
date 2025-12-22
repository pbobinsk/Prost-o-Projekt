# services/user-service/tests/test_security.py

import pytest
from jose import jwt
from security import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM

# Testy dla funkcji haszującej i weryfikującej hasło
def test_password_hashing_and_verification():
    password = "mysecretpassword"

    # 1. Sprawdź haszowanie
    hashed_password = get_password_hash(password)
    
    # As-ercja 1: Sprawdź, czy hash nie jest pusty
    assert hashed_password is not None
    # As-ercja 2: Sprawdź, czy hash jest stringiem
    assert isinstance(hashed_password, str)
    # As-ercja 3: Sprawdź, czy hash nie jest tym samym co oryginalne hasło
    assert password != hashed_password

    # 2. Sprawdź weryfikację
    # As-ercja 4: Poprawne hasło powinno zostać zweryfikowane pozytywnie
    assert verify_password(password, hashed_password) is True
    
    # As-ercja 5: Błędne hasło powinno zostać zweryfikowane negatywnie
    assert verify_password("wrongpassword", hashed_password) is False

# Test dla funkcji tworzącej token JWT
def test_create_access_token():
    # Przygotuj dane, które normalnie byłyby w tokenie
    data_to_encode = {"sub": "test@example.com", "id": "some_user_id"}
    
    token = create_access_token(data=data_to_encode)

    # As-ercja 1: Sprawdź, czy token został utworzony i jest stringiem
    assert token is not None
    assert isinstance(token, str)

    # As-ercja 2: Zdekoduj token i sprawdź jego zawartość (payload)
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Sprawdź, czy zdekodowane dane zgadzają się z oryginalnymi
        assert decoded_payload.get("sub") == data_to_encode["sub"]
        assert decoded_payload.get("id") == data_to_encode["id"]
        # Sprawdź, czy token ma pole 'exp' (expiration time)
        assert "exp" in decoded_payload

    except jwt.JWTError as e:
        # Jeśli dekodowanie się nie powiedzie, test powinien zawieść
        pytest.fail(f"Dekodowanie tokenu JWT nie powiodło się: {e}")