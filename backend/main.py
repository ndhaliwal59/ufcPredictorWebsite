from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from typing import Union

# Add these new imports for UFC prediction functionality
from contextlib import asynccontextmanager
import pandas as pd
import xgboost as xgb
from pathlib import Path

from database import get_db, engine
from models import Base, User
from auth import (
    authenticate_user, 
    create_access_token, 
    verify_token, 
    get_user_by_username,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Import the moved dependency
from app.core.auth_dependencies import get_current_user

# Add these imports for UFC prediction routes
from app.core.globals import set_models, set_datasets
from app.routes import predictions

# Create database tables
Base.metadata.create_all(bind=engine)

# Lifespan function for loading UFC models and datasets
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load models and datasets
    print("Loading UFC models and datasets...")
    
    try:
        # Load XGBoost models
        models = {}
        model_files = {
            'main': 'data/xgb_model_good.json',
            'p1_method': 'data/p1_method_target_xgboost_model.json',
            'p2_method': 'data/p2_method_target_xgboost_model.json'
        }
        
        for model_name, model_path in model_files.items():
            if Path(model_path).exists():
                model = xgb.XGBClassifier()
                model.load_model(model_path)
                models[model_name] = model
                print(f"Loaded {model_name} model")
        
        set_models(models)
        
        # Load CSV datasets
        datasets = {}
        dataset_files = {
            'ufc_data': 'data/ufc_cleaned.csv',
            'fighters': 'data/ufc_fighters_cleaned.csv'
        }
        
        for dataset_name, dataset_path in dataset_files.items():
            if Path(dataset_path).exists():
                dataset = pd.read_csv(dataset_path)
                datasets[dataset_name] = dataset
                print(f"Loaded {dataset_name} dataset with {len(dataset)} rows")
        
        set_datasets(datasets)
        
        print("All UFC models and datasets loaded successfully!")
        
    except Exception as e:
        print(f"Error loading UFC models/datasets: {e}")
        # Continue anyway - your auth system will still work
    
    yield
    
    # Shutdown
    print("Shutting down...")

# Create FastAPI app with lifespan
app = FastAPI(title="Login Backend API", lifespan=lifespan)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    is_active: bool

    class Config:
        from_attributes = True

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login endpoint that returns JWT token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@app.get("/dashboard")
async def dashboard(current_user: User = Depends(get_current_user)):
    """Protected dashboard endpoint."""
    return {"message": f"Welcome to dashboard, {current_user.username}!"}

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Login Backend API is running"}

# Include UFC prediction routes
try:
    app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
    print("UFC prediction routes added successfully")
except Exception as e:
    print(f"Could not add UFC prediction routes: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
