/**
 * Database Configuration
 * 
 * Contains MongoDB connection settings and utility functions.
 * The actual connection is established in server.js.
 */

const mongoose = require('mongoose');

// MongoDB connection options
const dbOptions = {
  // These are the recommended options for Mongoose 8.x
  // Most options are now set by default
};

/**
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, dbOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 * Useful for testing and graceful shutdown
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

module.exports = { connectDB, disconnectDB, dbOptions };