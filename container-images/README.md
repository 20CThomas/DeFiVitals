# DeFiVitals Container Images

This directory contains the containerized services for DeFiVitals. Each service is packaged as a Docker image in a tar file.

## Contents

- `frontend.tar` - Frontend service (Next.js)
- `api.tar` - API service
- `data.tar` - Data service
- `analytics.tar` - Analytics service
- `docker-compose.yml` - Docker Compose configuration

## Prerequisites

- Docker installed
- Docker Compose installed
- Ports 3007-3010 and 6380 available

## Setup Instructions

1. Create a `.env.local` file in this directory with the following variables:
```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3007
NEXT_PUBLIC_DATA_SERVICE_URL=http://localhost:3008
NEXT_PUBLIC_ANALYTICS_URL=http://localhost:3009

# API Environment Variables
API_PORT=3007
REDIS_URL=redis://redis:6379

# Data Service Environment Variables
DATA_SERVICE_PORT=3008
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Analytics Service Environment Variables
ANALYTICS_PORT=3009

# Redis Configuration
REDIS_PORT=6380
```

2. Load the Docker images:
```bash
docker load -i frontend.tar
docker load -i api.tar
docker load -i data.tar
docker load -i analytics.tar
```

3. Start the services:
```bash
docker-compose up -d
```

## Accessing Services

- Frontend: http://localhost:3010
- API Service: http://localhost:3007
- Data Service: http://localhost:3008
- Analytics Service: http://localhost:3009
- Redis: localhost:6380

## Useful Commands

- View logs:
```bash
docker-compose logs -f
```

- Stop services:
```bash
docker-compose down
```

- Restart a specific service:
```bash
docker-compose restart [service_name]
```

## Troubleshooting

If you encounter port conflicts:
1. Check if ports 3007-3010 and 6380 are available
2. Modify the port mappings in docker-compose.yml if needed
3. Ensure no other services are using the required ports 