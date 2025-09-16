# Multi-stage Dockerfile for FastAPI backend
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# System deps (if needed later) and security updates
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies separately for better layer caching
COPY backend/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application code
COPY backend/ .

# Expose port (Render sets $PORT)
EXPOSE 8000

# Healthcheck (simple TCP check handled by platform; optional curl-based one could be added)

# Start command (can be overridden by platform)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
