# 🍺 Beer Management Application

A simple and elegant beer drinking list application built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Add Beers**: Track beers you want to try with details like name, brewery, style, ABV, and notes
- **Rate Beers**: Give beers a 1-5 star rating after trying them
- **Mark as Drank**: Keep track of which beers you've already consumed
- **Statistics**: View your beer drinking statistics including total count, ratings, and top styles/breweries
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Instant updates when adding, editing, or deleting beers

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## Project Structure

```
beer-management/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BeerList.jsx
│   │   │   ├── BeerForm.jsx
│   │   │   └── BeerStats.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
└── package.json
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

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

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit the `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/beer-management
   PORT=5000
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Update the connection string in `.env`

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`

### Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### Production Build

Build the frontend for production:
```bash
npm run build
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/beers` - Get all beers
- `GET /api/beers/:id` - Get a specific beer
- `POST /api/beers` - Create a new beer
- `PUT /api/beers/:id` - Update a beer
- `DELETE /api/beers/:id` - Delete a beer
- `GET /api/health` - Health check

## Beer Schema

Each beer document contains the following fields:

```javascript
{
  name: String (required),
  brewery: String (required),
  style: String (required),
  abv: Number (required, 0-100),
  rating: Number (optional, 1-5),
  notes: String (optional),
  drank: Boolean (default: false),
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

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the appearance by:
- Modifying `tailwind.config.js` for theme customization
- Updating component classes in the React components
- Adding custom CSS in `src/index.css`

### Database
The application uses MongoDB with Mongoose. You can:
- Modify the beer schema in `backend/server.js`
- Add new fields or validation rules
- Create additional models for breweries, styles, etc.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the connection string in your `.env` file

2. **Port Already in Use**
   - Change the PORT in your `.env` file if 5000 is already in use
   - Kill any processes using the required ports

3. **CORS Issues**
   - The backend is configured to allow CORS from the frontend
   - If you encounter issues, check the CORS configuration in `server.js`

4. **Build Issues**
   - Ensure all dependencies are installed with `npm run install-all`
   - Clear node_modules and reinstall if needed

## Future Enhancements

- User authentication and profiles
- Beer recommendations based on preferences
- Social features (sharing beer lists)
- Photo uploads for beer labels
- Integration with beer databases (Untappd, BeerAdvocate)
- Mobile app with React Native
- Advanced filtering and search
- Export/import functionality

---

Happy beer tracking! 🍺
