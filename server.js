import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';
import { openDb, initializeDb, saveScore, getScores } from './db.js'; // Importing database functions

const app = express();
const PORT = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

let db;

(async () => {
  try {
    db = await openDb();
    await initializeDb(db);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
})();

app.post('/api/scores', async (req, res) => {
  const { score, name } = req.body;
  console.log('Received data:', { score, name });

  if (!name || score == null) {
    return res.status(400).json({ error: 'Name and score are required' });
  }

  try {
    const result = await saveScore(db, score, name);
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Error saving score:', error); // Log the actual error
    res.status(500).json({ error: 'Failed to save score' });
  }
});

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await getScores(db);
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error); // Log the actual error
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
