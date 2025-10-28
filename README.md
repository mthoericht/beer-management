# 🍺 Beer Management Application

A simple and elegant beer drinking list application built with Vue.js, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Add Beers**: Track beers you want to try with details like name, brewery, style, ABV, and notes
- **Rate Beers**: Give beers a 1-5 star rating after trying them
- **Mark as Drank**: Keep track of which beers you've already consumed
- **Statistics**: View your beer drinking statistics including total count, ratings, and top styles/breweries
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Instant updates when adding, editing, or deleting beers

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Typed JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** (or Vuex) - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Typed JavaScript

## Project Structure

```
beer-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── BeerController.ts
│   │   ├── models/
│   │   │   └── Beer.ts
│   │   ├── routes/
│   │   │   └── beerRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── dist/           # Compiled JavaScript
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BeerList.vue
│   │   │   ├── BeerForm.vue
│   │   │   ├── BeerStats.vue
│   │   │   └── LoadingSpinner.vue
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── index.html
├── data/
│   └── db/             # MongoDB data directory
├── start-db.sh          # Start MongoDB and backend
├── stop-db.sh           # Stop all services
├── restart-db.sh        # Restart all services
├── logs.sh              # View service status
└── package.json
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation recommended)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beer-management
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   
   This installs dependencies for the root, backend, and frontend projects.

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit the `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/beer-management
   PORT=5001
   ```

## Running the Application

### Quick Start (MongoDB + Backend)

Start MongoDB and backend server together:
```bash
npm run start-db
```

Or use the script directly:
```bash
./start-db.sh
```

This will start:
- MongoDB on port `27017`
- Backend API server on `http://localhost:5001`

### Complete Development Setup

Start all services (MongoDB, Backend, Frontend):
```bash
# Terminal 1: Start database and backend
npm run start-db

# Terminal 2: Start frontend
npm run client
```

Or run everything in development mode:
```bash
npm run dev
```

### Individual Services

**Database Management:**
```bash
npm run start-db     # Start MongoDB
npm run stop-db      # Stop MongoDB
npm run restart-db   # Restart services
npm run status       # Check service status
```

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

**Stop all servers:**
```bash
npm run stop-servers
```

### Production Build

Build the frontend for production:
```bash
npm run build
```

Build the backend:
```bash
cd backend
npm run build
```

## Available Scripts

### Root Level
- `npm run dev` - Run frontend and backend concurrently
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run start-db` - Start MongoDB
- `npm run stop-db` - Stop MongoDB
- `npm run restart-db` - Restart all services
- `npm run status` - Check service status
- `npm run test-api` - Test API health endpoint
- `npm run stop-servers` - Kill all running servers
- `npm run fresh-install` - Clean and reinstall all dependencies

### Backend
- `npm run dev` - Run with nodemon (auto-reload)
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled JavaScript

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/beers` - Get all beers
- `GET /api/beers/:id` - Get a specific beer
- `POST /api/beers` - Create a new beer
- `PUT /api/beers/:id` - Update a beer
- `DELETE /api/beers/:id` - Delete a beer
- `GET /api/health` - Health check endpoint

### Example API Usage

```bash
# Get all beers
curl http://localhost:5001/api/beers

# Create a new beer
curl -X POST http://localhost:5001/api/beers \
  -H "Content-Type: application/json" \
  -d '{"name":"IPA","brewery":"Local Brewery","style":"IPA","abv":6.5}'

# Test health
curl http://localhost:5001/api/health
```

## Beer Schema

Each beer document contains the following fields:

```typescript
{
  name: string (required),
  brewery: string (required),
  style: string (required),
  abv: number (required, 0-100),
  rating: number (optional, 1-5),
  notes: string (optional),
  drank: boolean (default: false),
  dateAdded: Date (default: now),
  dateDrank: Date (optional)
}
```

## Usage

1. **Add a Beer**: Click the "Add New Beer" button and fill in the beer details
2. **Edit a Beer**: Click the "Edit" button on any beer card
3. **Mark as Drank**: Click "Mark as Drank" to track consumed beers
4. **Rate Beers**: Add a 1-5 star rating when editing a beer
5. **View Statistics**: Check the statistics panel for insights about your beer collection

## URLs

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health
- **Database**: mongodb://localhost:27017/beer-management

## Development

### TypeScript

Both frontend and backend use TypeScript:
- Frontend: Vue.js with `<script setup lang="ts">`
- Backend: Node.js with Express
- Type definitions in respective `types/index.ts` files

### Database

The application uses MongoDB with Mongoose. The database file is stored locally in `./data/db`.

**Important**: Don't commit `data/db/` to version control (it's in `.gitignore`).

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `npm run start-db`
   - Check if MongoDB is installed: `mongod --version`
   - Verify the connection in `.env` file

2. **Port Already in Use**
   - Backend: Change PORT in `.env` if 5001 is already in use
   - Frontend: Vite will suggest an alternative port automatically
   - Database: MongoDB uses port 27017

3. **TypeScript Errors**
   - Run `npm run build` in the backend to compile TypeScript
   - Check `tsconfig.json` for configuration

4. **CORS Issues**
   - The backend is configured to allow CORS from the frontend
   - Check CORS configuration in `backend/src/server.ts`

5. **Build Issues**
   - Ensure all dependencies are installed: `npm run install-all`
   - Clear `node_modules` and reinstall if needed: `npm run fresh-install`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- User authentication and profiles
- Beer recommendations based on preferences
- Social features (sharing beer lists)
- Photo uploads for beer labels
- Integration with beer databases (Untappd, BeerAdvocate)
- Mobile app with React Native/Vue Native
- Advanced filtering and search
- Export/import functionality
- Dark mode support

---

Happy beer tracking! 🍺