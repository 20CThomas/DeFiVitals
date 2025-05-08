import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { Registry, Counter, Histogram } from 'prom-client';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Prometheus metrics
const register = new Registry();
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware
app.use(cors());
app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode },
      duration / 1000
    );
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error generating metrics:', error);
    res.status(500).end();
  }
});

// Example analytics endpoint
app.post('/api/analytics', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    // Log the event
    logger.info('Analytics event received', { event, data });
    
    // Store in Redis for real-time analytics
    await redisClient.lPush('analytics-events', JSON.stringify({ event, data, timestamp: Date.now() }));
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing analytics event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');

    app.listen(port, () => {
      logger.info(`Analytics service listening on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 