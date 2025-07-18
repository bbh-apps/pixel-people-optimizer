# Use official slim Python image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed to build psycopg2 and git for any VCS installs
RUN apt-get update && apt-get install -y \
  git \
  build-essential \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for caching
COPY backend/requirements.txt ./requirements.txt

# Copy pixel_people_optimizer package folder so editable install works if used in requirements
COPY backend/pixel_people_optimizer ./pixel_people_optimizer

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY backend/ .

# Expose the port uvicorn listens on
EXPOSE 8080

# Run your FastAPI app with uvicorn
CMD ["sh", "-c", "uvicorn pixel_people_optimizer.main:app --host 0.0.0.0 --port $PORT"]
