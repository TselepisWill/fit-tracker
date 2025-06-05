const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Connection options for newer MongoDB drivers
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
      maxPoolSize: 10,  // Maintain up to 10 socket connections
      socketTimeoutMS: 45000,  // Close sockets after 45s of inactivity
      family: 4,  // Use IPv4, skip trying IPv6
    };

    // Connect with the connection string from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    // Event listeners for connection monitoring
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB cluster');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB'.yellow);
    });

    // Close the Mongoose connection when Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    logger.error(`Database connection failed: ${err.message}`.red);
    process.exit(1);  // Exit with failure
  }
};

// Advanced configuration for production
const configureDB = () => {
  if (process.env.NODE_ENV === 'production') {
    mongoose.set('debug', false);
    mongoose.set('autoIndex', false);  // Improve production performance
  } else {
    mongoose.set('debug', true);  // Log collection methods + arguments
  }
};

module.exports = { connectDB, configureDB };