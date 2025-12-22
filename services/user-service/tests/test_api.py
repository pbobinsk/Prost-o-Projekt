# tests/test_api.py

import pytest
import httpx
from bson import ObjectId

# Wskazujemy na kontener, w którym działa nasza aplikacja FastAPI
BASE_URL = "http://user-service-app-for-test:8000"

# Oznaczamy testy jako asynchroniczne
pytestmark = pytest.mark.anyio

# Testy pozostają praktycznie bez zmian, ale używają teraz prawdziwych żądań sieciowych
async def test_registration_flow():
    test_email = f"testuser_{ObjectId()}@example.com"
    test_password = "strongpassword123"
    
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        register_payload = {"email": test_email, "password": test_password}
        response = await client.post("/register", json=register_payload)
        
        assert response.status_code == 201
        response_data = response.json()
        assert response_data["email"] == test_email
        assert "id" in response_data

async def test_login_flow():
    test_email = f"testuser_{ObjectId()}@example.com"
    test_password = "strongpassword123"
    
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        await client.post("/register", json={"email": test_email, "password": test_password})
        
        login_payload = {"email": test_email, "password": test_password}
        response = await client.post("/login", json=login_payload)
        
        assert response.status_code == 200
        response_data = response.json()
        assert "access_token" in response_data

async def test_register_duplicate_user_fails():
    test_email = f"duplicate_{ObjectId()}@example.com"
    payload = {"email": test_email, "password": "password123"}

    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response1 = await client.post("/register", json=payload)
        assert response1.status_code == 201

        response2 = await client.post("/register", json=payload)
        assert response2.status_code == 400