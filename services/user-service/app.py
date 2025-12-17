from fastapi import FastAPI, HTTPException

# Inicjalizacja aplikacji FastAPI
app = FastAPI()

# Tymczasowa "baza danych" w pamięci, aby zasymulować dane
# W Fazie 3 zastąpimy to prawdziwą bazą MongoDB
mock_users_db = [
    {"id": 1, "name": "Jan Kowalski", "email": "jan.kowalski@example.com"},
    {"id": 2, "name": "Anna Nowak", "email": "anna.nowak@example.com"},
    {"id": 3, "name": "Piotr Zieliński", "email": "piotr.zielinski@example.com"},
]

# Definicja endpointu GET na ścieżce głównej ('/')
@app.get("/")
def get_all_users():
    """Zwraca listę wszystkich użytkowników."""
    return mock_users_db

# Definicja endpointu GET na ścieżce '/{user_id}'
@app.get("/{user_id}")
def get_user_by_id(user_id: int):
    """Zwraca dane pojedynczego użytkownika na podstawie jego ID."""
    # Wyszukaj użytkownika na liście
    user = next((user for user in mock_users_db if user["id"] == user_id), None)
    
    if user is None:
        # Jeśli użytkownik nie został znaleziony, zwróć błąd 404
        raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")
    
    return user