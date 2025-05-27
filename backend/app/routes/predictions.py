from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime
import pandas as pd
from app.services.predictor import UFCPredictor

# Import from the new auth dependencies module instead of main
from app.core.auth_dependencies import get_current_user

router = APIRouter()

class PredictionRequest(BaseModel):
    fighter_1: str
    fighter_2: str
    event_date: str  # Format: 'YYYY-MM-DD'
    referee: str
    prediction_type: str = 'winner'  # 'winner' or 'method'

@router.post("/predict", response_model=Dict[str, Any])
async def predict_fight(
    request: PredictionRequest,
    current_user = Depends(get_current_user)
):
    """
    Predict UFC fight outcome using your optimized prediction model.
    Supports both winner and method predictions.
    """
    try:
        predictor = UFCPredictor()
        
        # Validate prediction type
        if request.prediction_type not in ['winner', 'method']:
            raise HTTPException(
                status_code=400, 
                detail="prediction_type must be 'winner' or 'method'"
            )
        
        # Validate date format
        try:
            datetime.strptime(request.event_date, '%Y-%m-%d')
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="event_date must be in YYYY-MM-DD format"
            )
        
        # Make prediction using your optimized function
        result = predictor.combined_predict(
            p1=request.fighter_1,
            p2=request.fighter_2,
            eventDate=request.event_date,
            ref=request.referee,
            prediction_type=request.prediction_type
        )
        
        return {"success": True, "data": result}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/predict-with-shap", response_model=Dict[str, Any])
async def predict_fight_with_shap(
    request: PredictionRequest,
    current_user = Depends(get_current_user)
):
    """
    Predict UFC fight outcome with SHAP visualization.
    """
    try:
        # Add detailed logging for debugging
        print(f"=== PREDICTION REQUEST RECEIVED ===")
        print(f"Fighter 1: '{request.fighter_1}'")
        print(f"Fighter 2: '{request.fighter_2}'")
        print(f"Event date: '{request.event_date}'")
        print(f"Referee: '{request.referee}'")
        print(f"Prediction type: '{request.prediction_type}'")
        
        predictor = UFCPredictor()
        
        # Check if fighters exist BEFORE making prediction
        print("Checking if fighters exist in database...")
        try:
            fighter1_data = predictor.get_fighter_data(request.fighter_1)
            print(f"Fighter 1 found: {request.fighter_1}")
        except ValueError as e:
            print(f"Fighter 1 NOT FOUND: {request.fighter_1}")
            raise HTTPException(status_code=400, detail=f"Fighter 1 not found: {request.fighter_1}")
        
        try:
            fighter2_data = predictor.get_fighter_data(request.fighter_2)
            print(f"Fighter 2 found: {request.fighter_2}")
        except ValueError as e:
            print(f"Fighter 2 NOT FOUND: {request.fighter_2}")
            raise HTTPException(status_code=400, detail=f"Fighter 2 not found: {request.fighter_2}")
        
        # Validate prediction type
        if request.prediction_type not in ['winner', 'method']:
            raise HTTPException(
                status_code=400, 
                detail=f"prediction_type must be 'winner' or 'method', got: {request.prediction_type}"
            )
        
        # Validate date format
        try:
            parsed_date = datetime.strptime(request.event_date, '%Y-%m-%d')
            print(f"Date validation successful: {parsed_date}")
        except ValueError as e:
            print(f"Date validation failed: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"event_date must be in YYYY-MM-DD format. Received: '{request.event_date}'"
            )
        
        # Validate that names are not empty
        if not request.fighter_1.strip():
            raise HTTPException(status_code=400, detail="fighter_1 cannot be empty")
        if not request.fighter_2.strip():
            raise HTTPException(status_code=400, detail="fighter_2 cannot be empty")
        if not request.referee.strip():
            raise HTTPException(status_code=400, detail="referee cannot be empty")
        
        print("All validations passed, making prediction...")
        
        # Make prediction with SHAP visualization
        result = predictor.combined_predict_with_shap(
            p1=request.fighter_1,
            p2=request.fighter_2,
            eventDate=request.event_date,
            ref=request.referee,
            prediction_type=request.prediction_type
        )
        
        print("Prediction successful!")
        return {"success": True, "data": result}
        
    except ValueError as e:
        print(f"ValueError in prediction: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in prediction: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/fighter/{fighter_name}")
async def get_fighter_info(
    fighter_name: str,
    current_user = Depends(get_current_user)
):
    """Get fighter information from the database."""
    try:
        predictor = UFCPredictor()
        
        try:
            fighter_data = predictor.get_fighter_data(fighter_name)
            
            # Convert numpy types to Python types for JSON serialization
            fighter_info = {}
            for key, value in fighter_data.items():
                if hasattr(value, 'item'):  # numpy scalar
                    fighter_info[key] = value.item()
                elif isinstance(value, pd.Timestamp):
                    fighter_info[key] = value.strftime('%Y-%m-%d')
                else:
                    fighter_info[key] = value
            
            return {"success": True, "data": fighter_info}
            
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fighters/search")
async def search_fighters(
    query: str,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    """Search for fighters by name."""
    try:
        predictor = UFCPredictor()
        
        # Get all fighter names
        all_fighters = list(predictor.fighter_lookup.keys())
        
        # Filter fighters that match the query
        matching_fighters = [
            fighter for fighter in all_fighters 
            if query.lower() in fighter.lower()
        ][:limit]
        
        return {
            "success": True, 
            "data": {
                "query": query,
                "matches": matching_fighters,
                "total_found": len(matching_fighters)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/referees")
async def get_referees(current_user = Depends(get_current_user)):
    """Get list of referees and their frequency."""
    try:
        predictor = UFCPredictor()
        
        # Get top referees by frequency
        top_referees = dict(sorted(
            predictor.referee_counts_cache.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:20])
        
        return {
            "success": True,
            "data": {
                "top_referees": top_referees,
                "total_referees": len(predictor.referee_counts_cache)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models/status")
async def get_model_status(current_user = Depends(get_current_user)):
    """Get status of loaded models and datasets."""
    try:
        predictor = UFCPredictor()
        
        return {
            "success": True,
            "data": {
                "models_loaded": {
                    "main_model": predictor.loaded_model is not None,
                    "p1_method_model": predictor.p1_model is not None,
                    "p2_method_model": predictor.p2_model is not None,
                },
                "datasets_loaded": {
                    "ufc_data_rows": len(predictor.cleaned_df),
                    "fighters_count": len(predictor.fighters_df),
                    "cached_fighters": len(predictor.fighter_lookup),
                    "cached_referees": len(predictor.referee_counts_cache)
                },
                "shap_available": True
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
