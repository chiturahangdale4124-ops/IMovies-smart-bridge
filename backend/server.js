require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: '*', // Allow all origins for dev/production flexibility
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'IMovies API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect DB and Start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty so app works immediately
    const Movie = require('./models/Movie');
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[IMovies Server] Fresh database detected. Auto-seeding initial catalogue...');
      const seedData = require('./seed');
      await seedData();
    }
    const server = app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🎬 IMovies Backend Server running on port ${PORT}`);
      console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
      console.log(`=================================================`);
    });
    return server;
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
