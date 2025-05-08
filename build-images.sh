#!/bin/bash

# Set variables
REGISTRY="gcr.io"
PROJECT_ID="your-project-id"  # Replace with your GCP project ID
VERSION=$(date +%Y%m%d_%H%M%S)

# Build and save images for each service
echo "Building API service..."
docker build -t ${REGISTRY}/${PROJECT_ID}/defivitals-api:${VERSION} -t ${REGISTRY}/${PROJECT_ID}/defivitals-api:latest ./services/api
docker save ${REGISTRY}/${PROJECT_ID}/defivitals-api:${VERSION} > ./images/defivitals-api-${VERSION}.tar

echo "Building Frontend service..."
docker build -t ${REGISTRY}/${PROJECT_ID}/defivitals-frontend:${VERSION} -t ${REGISTRY}/${PROJECT_ID}/defivitals-frontend:latest ./services/frontend
docker save ${REGISTRY}/${PROJECT_ID}/defivitals-frontend:${VERSION} > ./images/defivitals-frontend-${VERSION}.tar

echo "Building Analytics service..."
docker build -t ${REGISTRY}/${PROJECT_ID}/defivitals-analytics:${VERSION} -t ${REGISTRY}/${PROJECT_ID}/defivitals-analytics:latest ./services/analytics
docker save ${REGISTRY}/${PROJECT_ID}/defivitals-analytics:${VERSION} > ./images/defivitals-analytics-${VERSION}.tar

echo "Building Data service..."
docker build -t ${REGISTRY}/${PROJECT_ID}/defivitals-data:${VERSION} -t ${REGISTRY}/${PROJECT_ID}/defivitals-data:latest ./services/data
docker save ${REGISTRY}/${PROJECT_ID}/defivitals-data:${VERSION} > ./images/defivitals-data-${VERSION}.tar

echo "Images built and saved successfully!"
echo "To push to Google Container Registry:"
echo "1. Configure Docker to use GCP credentials:"
echo "   gcloud auth configure-docker"
echo "2. Push images:"
echo "   docker push ${REGISTRY}/${PROJECT_ID}/defivitals-api:${VERSION}"
echo "   docker push ${REGISTRY}/${PROJECT_ID}/defivitals-frontend:${VERSION}"
echo "   docker push ${REGISTRY}/${PROJECT_ID}/defivitals-analytics:${VERSION}"
echo "   docker push ${REGISTRY}/${PROJECT_ID}/defivitals-data:${VERSION}" 