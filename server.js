import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';
import { openDb, initializeDb, saveScore, getScores, closeDb } from './db.js'; // Importing updated database functions
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

(async () => {
  try {
    await openDb();
    await initializeDb();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing the database:', error);
    process.exit(1);
  }
})();

app.post('/api/scores', async (req, res) => {
  const { score, name } = req.body;
  console.log('Received data:', { score, name });

  if (!name || score == null) {
    return res.status(400).json({ error: 'Name and score are required' });
  }

  try {
    const result = await saveScore(name, score);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await getScores();
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Accessible on your network at http://${getLocalIpAddress()}:${PORT}`);
});

process.on('SIGINT', async () => {
  try {
    await closeDb();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'localhost';
}
