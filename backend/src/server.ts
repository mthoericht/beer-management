import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import beerRoutes from './routes/beerRoutes';
import { IApiResponse } from './types';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5001', 10);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    // Configure CORS with explicit options
    this.app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/api/health', (req: Request, res: Response) => {
      const response: IApiResponse = {
        success: true,
        message: 'Beer Management API is running',
        data: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development'
        }
      };
      res.json(response);
    });

    // API routes
    this.app.use('/api/beers', beerRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      const response: IApiResponse = {
        success: false,
        error: 'Route not found'
      };
      res.status(404).json(response);
    });
  }

  private initializeDatabase(): void {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beer-management';
    
    mongoose.connect(mongoUri)
      .then(() => {
        console.log('✅ Connected to MongoDB');
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
      });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('📊 MongoDB connection established');
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
      console.log(`📡 API available at http://localhost:${this.port}/api`);
      console.log(`🏥 Health check at http://localhost:${this.port}/api/health`);
    });
  }
}

// Start the server
const app = new App();
app.listen();
