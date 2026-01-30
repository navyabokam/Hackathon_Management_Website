import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://myAtlasDBUser:XXXXXXXXXXXX@myatlasclusteredu.bw6sol8.mongodb.net/hackathon?retryWrites=true&w=majority';

console.log('Starting MongoDB connection test...');
console.log('URI:', mongoUri.replace(/:[^@]+@/, ':***@'));

const timeout = setTimeout(() => {
  console.error('Connection timeout after 15 seconds');
  process.exit(1);
}, 15000);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000,
})
.then(() => {
  clearTimeout(timeout);
  console.log('✓ Successfully connected to MongoDB');
  process.exit(0);
})
.catch((error) => {
  clearTimeout(timeout);
  console.error('✗ Connection failed:', error.message);
  process.exit(1);
});
