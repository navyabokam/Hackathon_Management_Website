import mongoose from 'mongoose';

async function dropCollection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hackathon');
    console.log('Connected to MongoDB');
    
    // Drop the teams collection to clear old indexes
    await mongoose.connection.collection('teams').drop();
    console.log('Teams collection dropped successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

dropCollection();
