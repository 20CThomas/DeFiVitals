import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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

// Example Firestore data endpoint
app.get('/api/data', async (req, res) => {
  try {
    // Check cache first
    const cachedData = await redisClient.get('firestore-data');
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from Firestore
    const querySnapshot = await getDocs(collection(db, 'test'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Cache the result
    await redisClient.set('firestore-data', JSON.stringify(data), {
      EX: 300 // Cache for 5 minutes
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    app.listen(port, () => {
      console.log(`Data service listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 