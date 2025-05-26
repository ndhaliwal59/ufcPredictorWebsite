from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost/ufc_db"
    
    # Model paths
    model_path: Path = Path("data/model.json")
    dataset_path: Path = Path("data/dataset.csv")
    
    # API settings
    api_title: str = "UFC Prediction API"
    api_version: str = "1.0.0"
    
    class Config:
        env_file = ".env"

settings = Settings()
