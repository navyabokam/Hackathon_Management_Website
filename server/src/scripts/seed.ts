import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { createAdminUser, getAdminByEmail } from '../services/index.js';

async function seed(): Promise<void> {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✓ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await getAdminByEmail(config.admin.email);
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
    } else {
      // Create admin user
      await createAdminUser(config.admin.email, config.admin.password);
      console.log(`✓ Admin user created: ${config.admin.email}`);
    }

    await mongoose.disconnect();
    console.log('✓ Seed completed');
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  }
}

seed();
