from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def create_default_user():
    """Create a default user for testing."""
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("User 'admin' already exists!")
            user = db.query(User).filter(User.username == "admin").first()
            if user:
                  print(f"✅ User found: {user.username}")
                  print(f"✅ Hashed password: {user.hashed_password[:50]}...")
                  print(f"✅ Is active: {user.is_active}")
            return
        
        
        # Create new user
        hashed_password = get_password_hash("admin123")
        db_user = User(
            username="admin",
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print("Default user created successfully!")
        print("Username: admin")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Error creating user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_default_user()
