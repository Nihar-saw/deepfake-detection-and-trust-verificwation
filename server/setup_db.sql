-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS deeptrust_db;
USE deeptrust_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  provider VARCHAR(50) DEFAULT 'local',
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Forensic History Table
CREATE TABLE IF NOT EXISTS forensic_history (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  file_name VARCHAR(255),
  type VARCHAR(50),
  size VARCHAR(50),
  authenticity_score FLOAT,
  confidence VARCHAR(50),
  forensic_breakdown JSON,
  flags JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
