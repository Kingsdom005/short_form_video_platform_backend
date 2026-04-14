#!/usr/bin/env bash
set -e

mysql -h 127.0.0.1 -u root -proot < ./database/schema.sql
mysql -h 127.0.0.1 -u root -proot < ./database/seed.sql

echo "Database initialized."
