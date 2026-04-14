@echo off

REM Database initialization script for Windows
REM This script creates all necessary tables for the backend system

echo Starting database initialization...
echo.

REM Connect to MySQL and execute the SQL scripts
mysql -u root -p douyin_agent < "%~dp0backend-user-schema.sql"
mysql -u root -p douyin_agent < "%~dp0role-permission-schema.sql"

echo.
echo Database initialization completed!
echo.
echo Please check the output above for any errors.
pause