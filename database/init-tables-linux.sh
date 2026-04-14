#!/bin/bash

# Database initialization script for Linux
# This script creates all necessary tables for the backend system

echo "Starting database initialization..."
echo

# Connect to MySQL and execute the SQL scripts
mysql -u root -p douyin_agent < "$(dirname "$0")/backend-user-schema.sql"
mysql -u root -p douyin_agent < "$(dirname "$0")/role-permission-schema.sql"

echo
echo "Database initialization completed!"
echo
echo "Please check the output above for any errors."
read -p "Press Enter to continue..."
