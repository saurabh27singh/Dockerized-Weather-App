# Dockerized Fullstack Application

A containerized fullstack application with FastAPI backend and React frontend, optimized for deployment on IBM Cloud.

## Architecture

- **Backend**: FastAPI with Python 3.13 and uv for dependency management
- **Frontend**: React with Vite build tool, served by Nginx
- **Containerization**: Docker and Docker Compose for easy deployment

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Python 3.13+ (for local development)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dockerized_stuff
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Backend docs: http://localhost:8000/docs

## Development

### Local Development (without Docker)

**Backend:**
```bash
cd backend
pip install uv
uv sync
uv run python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Docker Development

**Build individual services:**
```bash
# Backend only
docker-compose up backend

# Frontend only  
docker-compose up frontend
```

**Rebuild after changes:**
```bash
docker-compose up --build
```

## Deployment

### IBM Cloud Deployment

1. **Build for production:**
   ```bash
   docker-compose build
   ```

2. **Tag images for IBM Cloud Container Registry:**
   ```bash
   docker tag dockerized-fullstack-app_backend:latest us.icr.io/your-namespace/backend:latest
   docker tag dockerized-fullstack-app_frontend:latest us.icr.io/your-namespace/frontend:latest
   ```

3. **Push to registry:**
   ```bash
   docker push us.icr.io/your-namespace/backend:latest
   docker push us.icr.io/your-namespace/frontend:latest
   ```

### Environment Variables

- `WEATHER_API_KEY`: Required for backend weather functionality

## Project Structure

```
dockerized_stuff/
├── backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── main.py
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── docker-compose.yml
└── README.md
```

## Features

- **Multi-stage builds** for optimized production images
- **Nginx proxy** for API routing from frontend to backend
- **Health checks** and restart policies
- **Network isolation** with custom Docker network
- **Production-ready** configuration for IBM Cloud

## Troubleshooting

**Port conflicts:**
- Change ports in `docker-compose.yml` if 3000 or 8000 are in use

**Build issues:**
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`

**API connectivity:**
- Ensure backend is running before frontend
- Check network configuration in docker-compose.yml 