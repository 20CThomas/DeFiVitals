import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Example DeFi data endpoint
app.get('/api/protocols', async (req, res) => {
  try {
    // Check cache first
    const cachedData = await redisClient.get('protocols');
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from source
    // TODO: Implement actual DeFi data fetching
    const protocols = [
      { name: 'Aave', tvl: 1000000 },
      { name: 'Uniswap', tvl: 2000000 }
    ];

    // Cache the result
    await redisClient.set('protocols', JSON.stringify(protocols), {
      EX: 300 // Cache for 5 minutes
    });

    res.json(protocols);
  } catch (error) {
    console.error('Error fetching protocols:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    app.listen(port, () => {
      console.log(`API service listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 