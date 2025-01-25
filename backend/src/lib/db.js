// backend\src\lib\db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Log the full error for debugging
    console.error('Full error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
