const mongoose = require('mongoose');

let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    const MONGO_STRING = process.env.MONGO_STRING || process.env.MONGODB_URI;
    
    if (!MONGO_STRING) {
      throw new Error('MongoDB connection string not found in environment variables');
    }

    console.log('Creating new database connection');
    
    const db = await mongoose.connect(MONGO_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = db;
    console.log('Connected to Database');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = { connectToDatabase };
