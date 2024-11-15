import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const client = new MongoClient(uri, {
});

let db;

export async function openDb() {
  if (!db) {
    try {
      await client.connect();
      db = client.db();
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas', error);
      throw error;
    }
  }
  return db;
}

export async function initializeDb() {
  if (!db) {
    await openDb();
  }
  const scoresCollection = db.collection('scores');

  await scoresCollection.createIndex({ score: -1 });
  await scoresCollection.createIndex({ name: 1 }); 

  console.log('Initialized scores collection');
}

export async function saveScore(name, score) {
  if (!Number.isInteger(score)) throw new Error('Score must be an integer');
  if (!name) throw new Error('Name is required');

  const scoresCollection = db.collection('scores');

  const result = await scoresCollection.insertOne({ name, score, createdAt: new Date() });
  return result;
}

export async function getScores(limit = 10) {
  const scoresCollection = db.collection('scores');

  const topScores = await scoresCollection
    .find({})
    .sort({ score: -1, createdAt: 1 })
    .limit(limit)
    .project({ _id: 0, name: 1, score: 1 })
    .toArray();

  return topScores;
}

export async function closeDb() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}
