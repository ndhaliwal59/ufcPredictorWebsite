# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy backend files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
