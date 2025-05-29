# app/routes/events.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.orm.attributes import flag_modified
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import date, datetime

from database import get_db
from models import Event, Match, User
from app.core.auth_dependencies import get_current_user

router = APIRouter()

# Input-only Pydantic models (no response models)
class EventCreate(BaseModel):
    name: str
    date: date

class EventUpdate(BaseModel):
    name: str
    date: date

class MatchCreate(BaseModel):
    fighter1: str
    fighter2: str
    odds1: str
    odds2: str
    referee: str
    event_date: date
    prediction_data: Optional[Dict[str, Any]] = None

class MatchUpdate(BaseModel):
    result: str

# Event endpoints - NO response_model declarations
@router.get("/events")
async def get_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all events for the current user."""
    try:
        print(f"=== GET EVENTS DEBUG ===")
        print(f"User ID: {current_user.id}")
        
        # Use selectinload to eagerly load matches
        events = db.query(Event).options(selectinload(Event.matches)).filter(
            Event.user_id == current_user.id
        ).order_by(Event.date.desc()).all()
        
        print(f"Found {len(events)} events")
        
        events_data = []
        for event in events:
            print(f"\n--- Processing Event: {event.name} ---")
            print(f"Event has {len(event.matches)} matches")
            
            matches_data = []
            for match in (event.matches or []):
                print(f"\n  Match: {match.fighter1} vs {match.fighter2}")
                print(f"  Match ID: {match.id}")
                print(f"  Raw prediction_data from DB: {match.prediction_data}")
                print(f"  Type of prediction_data: {type(match.prediction_data)}")
                
                if match.prediction_data:
                    print(f"  Prediction data keys: {list(match.prediction_data.keys())}")
                    if 'fighter1MethodPercentages' in match.prediction_data:
                        print(f"  Fighter1 methods: {match.prediction_data['fighter1MethodPercentages']}")
                    if 'fighter2MethodPercentages' in match.prediction_data:
                        print(f"  Fighter2 methods: {match.prediction_data['fighter2MethodPercentages']}")
                    
                    # Make sure method percentages are included
                    if 'fighter1MethodPercentages' not in match.prediction_data and 'fighter_1_method_percentages' in match.prediction_data:
                        match.prediction_data['fighter1MethodPercentages'] = match.prediction_data.get('fighter_1_method_percentages', [])
                    if 'fighter2MethodPercentages' not in match.prediction_data and 'fighter_2_method_percentages' in match.prediction_data:
                        match.prediction_data['fighter2MethodPercentages'] = match.prediction_data.get('fighter_2_method_percentages', [])
                else:
                    print(f"  NO PREDICTION DATA FOUND!")
                
                match_dict = {
                    'id': str(match.id),
                    'fighter1': match.fighter1,
                    'fighter2': match.fighter2,
                    'odds1': match.odds1,
                    'odds2': match.odds2,
                    'referee': match.referee,
                    'event_date': match.event_date.isoformat(),
                    'result': match.result,
                    'prediction_data': match.prediction_data,
                    'created_at': match.created_at.isoformat()
                }
                
                print(f"  Match dict prediction_data: {match_dict['prediction_data']}")
                matches_data.append(match_dict)
            
            event_dict = {
                'id': str(event.id),
                'name': event.name,
                'date': event.date.isoformat(),
                'created_at': event.created_at.isoformat(),
                'matches': matches_data
            }
            events_data.append(event_dict)
        
        print(f"\n=== FINAL EVENTS DATA ===")
        for event in events_data:
            print(f"Event: {event['name']}")
            for match in event['matches']:
                print(f"  Match prediction_data: {match['prediction_data']}")
        
        return events_data
        
    except Exception as e:
        print(f"Error in get_events: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch events: {str(e)}")

@router.post("/events")
async def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new event."""
    try:
        db_event = Event(
            name=event_data.name,
            date=event_data.date,
            user_id=current_user.id
        )
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        
        # Return structured response with empty matches array
        return {
            'id': str(db_event.id),
            'name': db_event.name,
            'date': db_event.date.isoformat(),
            'created_at': db_event.created_at.isoformat(),
            'matches': []  # Ensure matches is always an array
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")

@router.put("/events/{event_id}")
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an event."""
    try:
        db_event = db.query(Event).options(selectinload(Event.matches)).filter(
            Event.id == event_id,
            Event.user_id == current_user.id
        ).first()
        
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        db_event.name = event_data.name
        db_event.date = event_data.date
        db_event.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_event)
        
        # Return structured response with matches
        return {
            'id': str(db_event.id),
            'name': db_event.name,
            'date': db_event.date.isoformat(),
            'created_at': db_event.created_at.isoformat(),
            'matches': [
                {
                    'id': str(match.id),
                    'fighter1': match.fighter1,
                    'fighter2': match.fighter2,
                    'odds1': match.odds1,
                    'odds2': match.odds2,
                    'referee': match.referee,
                    'event_date': match.event_date.isoformat(),
                    'result': match.result,
                    'prediction_data': match.prediction_data,
                    'created_at': match.created_at.isoformat()
                }
                for match in (db_event.matches or [])
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update event: {str(e)}")

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an event and all its matches."""
    try:
        db_event = db.query(Event).filter(
            Event.id == event_id,
            Event.user_id == current_user.id
        ).first()
        
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        db.delete(db_event)
        db.commit()
        
        return {"message": "Event deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")

# Match endpoints
@router.post("/events/{event_id}/matches")
async def create_match(
    event_id: str,
    match_data: MatchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new match for an event."""
    try:
        print(f"=== CREATE MATCH DEBUG ===")
        print(f"Event ID: {event_id}")
        print(f"User ID: {current_user.id}")
        print(f"Match data: {match_data}")
        print(f"Prediction data received: {match_data.prediction_data}")
        
        # Verify event exists and belongs to user
        db_event = db.query(Event).filter(
            Event.id == event_id,
            Event.user_id == current_user.id
        ).first()
        
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Process prediction data to ensure it's properly formatted
        prediction_data = match_data.prediction_data
        if prediction_data:
            print(f"Original prediction data keys: {list(prediction_data.keys())}")
            
            # Ensure method percentages are preserved properly
            if 'fighter1MethodPercentages' in prediction_data:
                print(f"Fighter1 method percentages: {prediction_data['fighter1MethodPercentages']}")
            if 'fighter2MethodPercentages' in prediction_data:
                print(f"Fighter2 method percentages: {prediction_data['fighter2MethodPercentages']}")
        
        # Create the match object
        db_match = Match(
            event_id=event_id,
            fighter1=match_data.fighter1,
            fighter2=match_data.fighter2,
            odds1=match_data.odds1,
            odds2=match_data.odds2,
            referee=match_data.referee,
            event_date=match_data.event_date,
            prediction_data=prediction_data
        )
        
        # CRITICAL: Tell SQLAlchemy that the JSON field has been modified
        flag_modified(db_match, "prediction_data")
        
        print(f"Database match object before save: {db_match}")
        print(f"Prediction data being saved: {db_match.prediction_data}")
        
        # Add to database
        db.add(db_match)
        db.commit()
        db.refresh(db_match)
        
        print(f"Database match object after save: {db_match}")
        print(f"Saved prediction data: {db_match.prediction_data}")
        
        # Return structured response
        response_data = {
            'id': str(db_match.id),
            'fighter1': db_match.fighter1,
            'fighter2': db_match.fighter2,
            'odds1': db_match.odds1,
            'odds2': db_match.odds2,
            'referee': db_match.referee,
            'event_date': db_match.event_date.isoformat(),
            'result': db_match.result,
            'prediction_data': db_match.prediction_data,
            'prediction': db_match.prediction_data,
            'created_at': db_match.created_at.isoformat()
        }
        
        print(f"Response data being returned: {response_data}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error creating match: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create match: {str(e)}")

@router.put("/matches/{match_id}")
async def update_match_result(
    match_id: str,
    match_data: MatchUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update match result."""
    try:
        # Find match and verify it belongs to user
        db_match = db.query(Match).join(Event).filter(
            Match.id == match_id,
            Event.user_id == current_user.id
        ).first()
        
        if not db_match:
            raise HTTPException(status_code=404, detail="Match not found")
        
        if match_data.result not in ["pending", "hit", "miss"]:
            raise HTTPException(status_code=400, detail="Invalid result value")
        
        db_match.result = match_data.result
        db_match.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_match)
        
        # Return structured response
        return {
            'id': str(db_match.id),
            'fighter1': db_match.fighter1,
            'fighter2': db_match.fighter2,
            'odds1': db_match.odds1,
            'odds2': db_match.odds2,
            'referee': db_match.referee,
            'event_date': db_match.event_date.isoformat(),
            'result': db_match.result,
            'prediction_data': db_match.prediction_data,
            'created_at': db_match.created_at.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating match result: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update match result: {str(e)}")

@router.delete("/matches/{match_id}")
async def delete_match(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a match."""
    try:
        # Find match and verify it belongs to user
        db_match = db.query(Match).join(Event).filter(
            Match.id == match_id,
            Event.user_id == current_user.id
        ).first()
        
        if not db_match:
            raise HTTPException(status_code=404, detail="Match not found")
        
        db.delete(db_match)
        db.commit()
        
        return {"message": "Match deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting match: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete match: {str(e)}")
