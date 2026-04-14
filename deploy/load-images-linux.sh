#!/usr/bin/env bash
set -euo pipefail
IMG_DIR="$(cd "$(dirname "$0")" && pwd)/images"
[ -d "$IMG_DIR" ] || { echo "images directory not found: $IMG_DIR"; exit 1; }
for f in "$IMG_DIR"/*.tar; do
  [ -e "$f" ] || { echo "no tar files found"; exit 1; }
  echo "Loading image $f"
  docker load -i "$f"
done
docker images
