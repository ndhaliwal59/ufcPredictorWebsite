from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "UFC Prediction API"}

@router.get("/model/info")
async def model_info():
    """Get information about the loaded model."""
    from app.core.globals import get_model, get_dataset
    
    try:
        model = get_model()
        dataset = get_dataset()
        
        return {
            "model_loaded": True,
            "dataset_loaded": True,
            "dataset_shape": dataset.shape,
            "model_type": type(model).__name__
        }
    except Exception as e:
        return {
            "model_loaded": False,
            "dataset_loaded": False,
            "error": str(e)
        }
