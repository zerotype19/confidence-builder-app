const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Define routes
app.use('/api/auth', require('./services/user-service/routes/auth'));
app.use('/api/children', require('./services/user-service/routes/children'));
app.use('/api/pillars', require('./services/content-service/routes/pillars'));
app.use('/api/activities', require('./services/content-service/routes/activities'));
app.use('/api/challenges', require('./services/challenge-service/routes/challenges'));
app.use('/api/progress', require('./services/progress-service/routes/progress'));
app.use('/api/habits', require('./services/progress-service/routes/habits'));
app.use('/api/notifications', require('./services/notification-service/routes/notifications'));
app.use('/api/health', require('./services/health-service/health'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
