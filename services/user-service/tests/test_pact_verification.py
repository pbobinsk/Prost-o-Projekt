# services/user-service/tests/test_pact_verification.py

import pytest
import os
from pact import Verifier
from pymongo import MongoClient

# Zakładam, że te moduły masz w swoim projekcie (zgodnie z poprzednią rozmową)
from security import get_password_hash

def setup_db_state():
    """
    Przygotowuje stan bazy danych tak, aby pasował do WSZYSTKICH interakcji w kontrakcie naraz.
    """
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017") # Fallback dla lokalnego uruchomienia
    client = MongoClient(mongo_uri)
    db = client.user_database
    collection = db["users"]

    # 1. Wyczyść całą bazę (to spełnia warunek dla rejestracji "no user exists")
    collection.delete_many({})

    # 2. Wstaw użytkownika dla pierwszej interakcji logowania
    collection.insert_one({
        "email": "pact.user@example.com",
        "hashed_password": get_password_hash("a.secure.password")
    })

    # 3. Wstaw użytkownika dla drugiej interakcji logowania
    collection.insert_one({
        "email": "test@example.com",
        "hashed_password": get_password_hash("password123")
    })

    print(f"\n[STATE SETUP] Database prepared. Users inserted: pact.user@example.com, test@example.com")
    client.close()

def test_pact_verification():
    # --- ARRANGE ---
    # Ręcznie przygotowujemy dane w bazie
    setup_db_state()

    # --- ACT ---
    pact_verifier = Verifier(
        provider='ProstOProjekt-UserService',
        # Upewnij się, że ten URL wskazuje na Twój działający kontener z aplikacją
        provider_base_url='http://user-service-app-for-test:8000'
    )
    
    # Ścieżka do pliku kontraktu
    pact_file = os.path.join(
        os.path.dirname(__file__), 
        '..', 
        'pacts', 
        'ProstOProjekt-Frontend-ProstOProjekt-UserService.json'
    )

    # Weryfikacja
    # provider_states_setup_url=None -> Mówimy Paktowi: "Nie wołaj endpointu stanów, ja to już ogarnąłem"
    success, logs = pact_verifier.verify_pacts(
        pact_file,
        provider_states_setup_url=None
    )

    # --- ASSERT ---
    if success != 0:
        print("\n!!!!!!!!!! PACT VERIFICATION FAILED !!!!!!!!!!")
        print("LOGS:")
        print(logs)
    
    assert success == 0, "Weryfikacja kontraktu zakończyła się błędem."