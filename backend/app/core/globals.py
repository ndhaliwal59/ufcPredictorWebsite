from typing import Optional, Dict
import pandas as pd
import xgboost as xgb

# Global variables to store models and datasets
_models: Optional[Dict[str, xgb.XGBClassifier]] = None
_datasets: Optional[Dict[str, pd.DataFrame]] = None
_cached_data: Optional[Dict] = None

def set_models(models: Dict[str, xgb.XGBClassifier]) -> None:
    """Set the global models dictionary."""
    global _models
    _models = models

def get_models() -> Dict[str, xgb.XGBClassifier]:
    """Get the global models dictionary."""
    if _models is None:
        raise RuntimeError("Models not loaded. Ensure startup completed successfully.")
    return _models

def get_model(model_name: str = 'main') -> xgb.XGBClassifier:
    """Get a specific model by name."""
    models = get_models()
    if model_name not in models:
        available = list(models.keys())
        raise ValueError(f"Model '{model_name}' not found. Available models: {available}")
    return models[model_name]

def set_datasets(datasets: Dict[str, pd.DataFrame]) -> None:
    """Set the global datasets dictionary and initialize caches."""
    global _datasets, _cached_data
    _datasets = datasets
    
    # Initialize caches like in your original code
    if 'ufc_data' in datasets and 'fighters' in datasets:
        cleaned_df = datasets['ufc_data']
        fighters_df = datasets['fighters']
        
        # Convert date columns and create caches
        cleaned_df['event_date'] = pd.to_datetime(cleaned_df['event_date'])
        fighters_df['dob'] = pd.to_datetime(fighters_df['dob'])
        
        # Cache referee counts and fighter lookups
        referee_counts_cache = cleaned_df['referee'].value_counts().to_dict()
        fighter_lookup = fighters_df.drop_duplicates(subset=['name'], keep='last').set_index('name').to_dict('index')
        
        _cached_data = {
            'referee_counts_cache': referee_counts_cache,
            'fighter_lookup': fighter_lookup
        }

def get_datasets() -> Dict[str, pd.DataFrame]:
    """Get the global datasets dictionary."""
    if _datasets is None:
        raise RuntimeError("Datasets not loaded. Ensure startup completed successfully.")
    return _datasets

def get_dataset(dataset_name: str = 'ufc_data') -> pd.DataFrame:
    """Get a specific dataset by name."""
    datasets = get_datasets()
    if dataset_name not in datasets:
        available = list(datasets.keys())
        raise ValueError(f"Dataset '{dataset_name}' not found. Available datasets: {available}")
    return datasets[dataset_name]

def get_cached_data() -> Dict:
    """Get cached lookup data."""
    if _cached_data is None:
        raise RuntimeError("Cached data not available. Ensure datasets loaded successfully.")
    return _cached_data
