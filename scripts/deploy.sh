#!/usr/bin/env bash
set -e

echo "========================================================"
echo " Starting ValuAltion Production Deployment Rollout"
echo "========================================================"

# Navigate to project directory if argument provided
if [ -n "$1" ]; then
  cd "$1"
fi

echo ">> 1. Pulling latest pre-built container images..."
docker compose pull

echo ">> 2. Starting services in background..."
docker compose up -d --remove-orphans

echo ">> 3. Waiting for service health checks..."
sleep 10

docker compose ps

echo ">> 4. Cleaning up old unused images..."
docker image prune -f

echo "========================================================"
echo " ValuAltion Deployment Completed Successfully!"
echo "========================================================"
