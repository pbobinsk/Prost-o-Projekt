# services/user-service/app.py
from fastapi import FastAPI, HTTPException, status
from bson import ObjectId
from database import user_collection
from security import get_password_hash, verify_password, create_access_token
from models import UserCreate, Token
from messaging import send_user_registered_message # NOWY IMPORT


app = FastAPI()

@app.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    # Sprawdź, czy użytkownik już istnieje
    # TERAZ TA LINIA JEST POPRAWNA, BO motor.find_one jest asynchroniczne
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik o tym emailu już istnieje",
        )
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    
    # motor.insert_one również jest asynchroniczne
    new_user = await user_collection.insert_one(user_dict)
    
    send_user_registered_message(user.email)

    # Zwracamy odpowiedź
    return {"id": str(new_user.inserted_id), "email": user.email}

@app.post("/login", response_model=Token)
async def login_for_access_token(user_credentials: UserCreate):
    # motor.find_one jest asynchroniczne
    user = await user_collection.find_one({"email": user_credentials.email})
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy email lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "id": str(user["_id"])}
    )
    return {"access_token": access_token, "token_type": "bearer"}