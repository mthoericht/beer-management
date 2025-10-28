"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const beerRoutes_1 = __importDefault(require("./routes/beerRoutes"));
dotenv_1.default.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '5000', 10);
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabase();
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    initializeRoutes() {
        this.app.get('/api/health', (req, res) => {
            const response = {
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
        this.app.use('/api/beers', beerRoutes_1.default);
        this.app.use('*', (req, res) => {
            const response = {
                success: false,
                error: 'Route not found'
            };
            res.status(404).json(response);
        });
    }
    initializeDatabase() {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beer-management';
        mongoose_1.default.connect(mongoUri)
            .then(() => {
            console.log('✅ Connected to MongoDB');
        })
            .catch((error) => {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        });
        const db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => {
            console.log('📊 MongoDB connection established');
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server is running on port ${this.port}`);
            console.log(`📡 API available at http://localhost:${this.port}/api`);
            console.log(`🏥 Health check at http://localhost:${this.port}/api/health`);
        });
    }
}
const app = new App();
app.listen();
//# sourceMappingURL=server.js.map