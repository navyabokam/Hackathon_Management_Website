import mongoose from 'mongoose';
import { config } from './config/index';

async function testConnection() {
  try {
    console.log('Starting connection test...');
    const uriDisplay = config.mongodbUri.replace(/:[^@]+@/, ':***@');
    console.log(`URI: ${uriDisplay}`);
    console.log('Attempting to connect...');
    
    // Set timeout
    await Promise.race([
      mongoose.connect(config.mongodbUri),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      ),
    ]);
    
    console.log('✓ Connected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testConnection();
