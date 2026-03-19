import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mode = 'mysql'; // Default to mysql
let db = null; // Either a mysql pool or sqlite connection

const createSqliteDB = async () => {
  const dbPath = path.join(__dirname, 'database.sqlite');
  console.log(`DB: initializing SQLite at ${dbPath}`);
  const sqliteDb = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      provider TEXT DEFAULT 'local',
      provider_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forensic_history (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      file_name TEXT,
      type TEXT,
      size TEXT,
      authenticity_score REAL,
      confidence TEXT,
      forensic_breakdown TEXT, -- SQLite stores JSON as text
      flags TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  
  return sqliteDb;
};

export const initDB = async () => {
  let mysqlConfig;
  
  // If a full connection string is provided (standard for remote DBs like Aiven, PlanetScale)
  if (process.env.DATABASE_URL) {
    mysqlConfig = process.env.DATABASE_URL;
  } else {
    mysqlConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'deeptrust_db'
    };
  }

  try {
    console.log('DB: Attempting MySQL connection...');
    const connection = await mysql.createConnection(mysqlConfig);
    if (!process.env.DATABASE_URL) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'deeptrust_db'}`);
    }
    await connection.end();

    db = mysql.createPool(mysqlConfig);
    mode = 'mysql';
    console.log('DB: MySQL operational and schema verified.');
    
    // Create Tables in MySQL (if not exists)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`
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
      )
    `);
  } catch (err) {
    console.warn('DB: MySQL connection failed. Error:', err.message);
    
    if (process.env.VERCEL === '1') {
      console.error('DB: SQLite fallback is DISABLED on Vercel. You MUST provide valid MySQL credentials.');
      throw new Error('Database connection failed on Vercel. Remote MySQL required.');
    }

    console.warn('DB: Falling back to SQLite for local development.');
    db = await createSqliteDB();
    mode = 'sqlite';
  }
};

export default {
  query: async (sql, params = []) => {
    if (!db) {
      await initDB();
    }
    
    if (mode === 'mysql') {
      return db.query(sql, params);
    } else {
      let rows;
      if (sql.toLowerCase().startsWith('select')) {
        rows = await db.all(sql, params);
        
        // Auto-parse JSON strings for SQLite
        rows = rows.map(row => {
          const processed = { ...row };
          if (typeof processed.forensic_breakdown === 'string') {
            try { processed.forensic_breakdown = JSON.parse(processed.forensic_breakdown); } catch (e) {}
          }
          if (typeof processed.flags === 'string') {
            try { processed.flags = JSON.parse(processed.flags); } catch (e) {}
          }
          return processed;
        });

        return [rows]; // Wrap in array to mimic mysql2 result structure [rows, fields]
      } else {
        const result = await db.run(sql, params);
        return [result];
      }
    }
  }
};
