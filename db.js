import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './scores.db',
    driver: sqlite3.Database
  });
}

export async function initializeDb(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL
    )
  `);
}

export async function saveScore(db, score, name) {
    if (!Number.isInteger(score)) throw new Error('Score must be an integer');
    if (!name) throw new Error('Name is required');
    return db.run('INSERT INTO scores (name, score) VALUES (?,?)', name, score);
  }
  

export async function getScores(db) {
  return db.all('SELECT name, score FROM scores ORDER BY score DESC LIMIT 10');
}