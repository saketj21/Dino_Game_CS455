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


const serverInstances = [
  { host: 'dino-game-cs-455.vercel.app', port: 3002 },
  { host: 'dino-game-cs-455.vercel.app', port: 3003 },
];

let currentIndex = 0;


function getNextServer() {
  const server = serverInstances[currentIndex];
  currentIndex = (currentIndex + 1) % serverInstances.length;
  return server;
}


function loadBalancerMiddleware(req, res, next) {
  const targetServer = getNextServer();
  console.log(`LoadBalancer: Routing request to ${targetServer.host}:${targetServer.port}`);
  
  next();
}

app.use(loadBalancerMiddleware);

const primaryServer = { host: 'localhost', port: 3002 };
const backupServer = { host: 'localhost', port: 3004 };

let isPrimaryActive = true;


function checkServerHealth() {
  console.log('Failover: Performing health check on primary server...');
  
  setInterval(() => {
    isPrimaryActive = !isPrimaryActive;
    console.log(`Failover: Primary server is now ${isPrimaryActive ? 'active' : 'inactive'}`);
  }, 300000); // 300,000 ms = 5 minutes
}

function failoverMiddleware(req, res, next) {
  if (isPrimaryActive) {
    console.log('Failover: Primary server is active. Processing request normally.');
    next();
  } else {
    console.log('Failover: Primary server is down. Redirecting to backup server.');
    
    // Simulated redirection
    
    res.status(503).json({ success: false, message: 'Redirected' });
  }
}

app.use(failoverMiddleware);

checkServerHealth();

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