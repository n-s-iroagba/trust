import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import { errorHandler } from './src/middlewares/errorHandler';
import { requestLogger } from './src/middlewares/requestLogger';
import adminWalletRoutes from './src/routers/adminWalletRoutes';
import clientWalletRoutes from './src/routers/clientWalletRoutes';
import transactionRoutes from './src/routers/transactionRoutes';
import logger from './src/services/logger/winstonLogger';
import sequelize from './src/config/database';
import authRoutes from './src/routers/authRoutes';
import clientRoutes from './src/routers/clientRoutes';

const app = express();
const PORT = process.env.NODE_ENV==='production'? 3000:5000;
// ✅ Define allowed origins dynamically
const allowedOrigins = [
  'http://localhost:3000', // local dev frontend
  'http://127.0.0.1:3000',
  'https://trust.app',     // replace with your actual production domain
  'https://www.trust.app',
];

// ✅ CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if using cookies or authentication headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // 🔥 required to allow cookies
}));
app.use(cookieParser()); 
app.use(helmet());


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TrustXWallet API'
  });
});

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/clients',clientRoutes)
app.use('/api/admin-wallets', adminWalletRoutes);
app.use('/api/client-wallets', clientWalletRoutes);
app.use('/api/transactions', transactionRoutes);


// 404 handler
app.use( (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync database (use { force: true } only in development to reset database)
    await sequelize.sync({ force: false });
    logger.info('Database synchronized');

    app.listen(PORT, () => {
      logger.info(`TrustXWallet server running on port ${PORT}`);
      console.log(`TrustXWallet API is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;