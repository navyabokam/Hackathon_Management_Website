import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Team, Payment, AdminUser } from './index';
import { config } from '../config/index';

describe('Database Models', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Team Model', () => {
    it('should create a team with required fields', async () => {
      const team = new Team({
        registrationId: 'HACK-2024-TEST001',
        teamName: 'Test Team',
        collegeName: 'Test College',
        teamSize: 2,
        participants: [
          {
            fullName: 'John Doe',
            email: 'john@test.com',
            phone: '1234567890',
            rollNumber: 'R001',
          },
        ],
        leaderEmail: 'leader@test.com',
        leaderPhone: '9876543210',
      });

      expect(team.registrationId).toBe('HACK-2024-TEST001');
      expect(team.status).toBe('PENDING_PAYMENT');
      expect(team.verificationStatus).toBe('Not Verified');
    });
  });

  describe('Payment Model', () => {
    it('should create a payment record', async () => {
      const teamId = new mongoose.Types.ObjectId();
      const payment = new Payment({
        teamId,
        amount: 500,
        currency: 'INR',
        status: 'Pending',
        transactionRef: 'TXN-TEST-001',
        provider: 'mock',
      });

      expect(payment.amount).toBe(500);
      expect(payment.status).toBe('Pending');
    });
  });

  describe('AdminUser Model', () => {
    it('should create an admin user', async () => {
      const admin = new AdminUser({
        email: 'admin@test.com',
        passwordHash: 'hashed_password',
        role: 'admin',
      });

      expect(admin.role).toBe('admin');
      expect(admin.email).toBe('admin@test.com');
    });
  });
});
