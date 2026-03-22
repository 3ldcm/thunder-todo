#!/bin/bash
# Test: docker-compose build exits 0 (both images build successfully)

set -e

echo "Testing Docker build..."

cd "$(dirname "$0")"

# Run docker compose build
if docker compose build; then
    echo "✓ docker compose build exited 0"
else
    echo "✗ docker compose build failed"
    exit 1
fi

echo "All Docker build tests passed!"
