@echo off
REM Batch file to create email marketing tables in PostgreSQL
REM Update the path to psql.exe and the SQL file as needed

SET PSQL_PATH="E:\Software\PostgreSQL\pgAdmin 4\runtime\psql.exe"
SET DB_USER=postgres
SET DB_NAME=postgres
SET SQL_FILE=%~dp0create_email_tables.sql

REM Prompt for password if not set in environment
%PSQL_PATH% -U %DB_USER% -d %DB_NAME% -f "%SQL_FILE%"

pause
