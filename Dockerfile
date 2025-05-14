# ---- FRONTEND BUILD ----
    FROM node:20 AS frontend

    WORKDIR /app
    COPY frontend ./frontend
    WORKDIR /app/frontend
    RUN npm install
    RUN npm run build
    
    # ---- BACKEND + FRONTEND SERVE ----
    FROM python:3.11-slim
    
    WORKDIR /app
    
    # Install FastAPI dependencies
    COPY backend/requirements.txt ./
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Copy backend code
    COPY backend ./backend
    
    # Copy frontend build output
    COPY --from=frontend /app/frontend/dist ./frontend/dist
    
    # Expose the port FastAPI runs on
    EXPOSE 8000
    
    # Start FastAPI
    CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
    