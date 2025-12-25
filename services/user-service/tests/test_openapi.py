# services/user-service/tests/test_openapi.py

import pytest
import httpx
import yaml
from pathlib import Path
from jsonschema import validate
from openapi_spec_validator import validate as validate_spec


# --- Konfiguracja i Wczytanie Specyfikacji ---
SPEC_PATH = Path("/specs/user-service-api.yaml")
with SPEC_PATH.open() as f:
    openapi_spec = yaml.safe_load(f)

# --- Testy ---
pytestmark = pytest.mark.anyio

def test_openapi_spec_is_valid():
    """
    Ten test gwarantuje, że nasz plik .yaml jest zgodny ze standardem OpenAPI 3.0.
    Chroni nas przed literówkami i błędami w samej definicji kontraktu.
    """
    try:
        validate_spec(openapi_spec)
    except Exception as e:
        pytest.fail(f"Specyfikacja OpenAPI ({SPEC_PATH}) jest niepoprawna: {e}")

BASE_URL = "http://user-service-app-for-test:8000"

async def test_login_response_complies_with_openapi_spec():
    # Arrange (bez zmian)
    
    test_email = "openapi-user@example.com"
    test_password = "password123"
    register_payload = {"email": test_email, "password": test_password}
    
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        await client.post("/register", json=register_payload)
        login_payload = {"email": test_email, "password": test_password}
        response = await client.post("/login", json=login_payload)
        response_data = response.json()

    # Assert
    # 1. Sprawdź status code
    assert response.status_code == 200

    # 2. Walidacja schematu
    try:
        # Wyciągnij definicję schematu 'Token' bezpośrednio z sekcji 'components'
        token_schema = openapi_spec['components']['schemas']['Token']

        # Zwaliduj odpowiedź (instancję) bezpośrednio względem tej definicji.
        # To jest najprostsze i najbardziej niezawodne podejście,
        # które omija problemy z rozwiązywaniem referencji '$ref'.
        validate(instance=response_data, schema=token_schema)

    except Exception as e:
        pytest.fail(f"Odpowiedź z /login NIE jest zgodna ze schematem w OpenAPI: {e}")

