const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please check:');
    console.error('  1. Your internet connection');
    console.error('  2. MongoDB Atlas cluster is running');
    console.error('  3. IP whitelist in MongoDB Atlas (0.0.0.0/0 for dev)');
    console.error('  4. MONGO_URI in .env file is correct');
    process.exit(1);
  }
};

module.exports = connectDB;