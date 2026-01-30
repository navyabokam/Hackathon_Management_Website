import { describe, it, expect } from 'vitest';
import { RegisterTeamSchema } from './index';

describe('Team Registration Schema', () => {
  it('should validate a correct registration', () => {
    const validData = {
      teamName: 'CodeMasters',
      collegeName: 'XYZ University',
      leaderEmail: 'leader@example.com',
      leaderPhone: '9876543210',
      participants: [
        {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '9876543211',
          rollNumber: 'CSE-001',
        },
      ],
    };

    const result = RegisterTeamSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      teamName: 'CodeMasters',
      collegeName: 'XYZ University',
      leaderEmail: 'invalid-email',
      leaderPhone: '9876543210',
      participants: [],
    };

    const result = RegisterTeamSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid phone', () => {
    const invalidData = {
      teamName: 'CodeMasters',
      collegeName: 'XYZ University',
      leaderEmail: 'leader@example.com',
      leaderPhone: '123',
      participants: [],
    };

    const result = RegisterTeamSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject more than 4 participants', () => {
    const invalidData = {
      teamName: 'CodeMasters',
      collegeName: 'XYZ University',
      leaderEmail: 'leader@example.com',
      leaderPhone: '9876543210',
      participants: [
        {
          fullName: 'P1',
          email: 'p1@example.com',
          phone: '9876543211',
          rollNumber: 'R1',
        },
        {
          fullName: 'P2',
          email: 'p2@example.com',
          phone: '9876543212',
          rollNumber: 'R2',
        },
        {
          fullName: 'P3',
          email: 'p3@example.com',
          phone: '9876543213',
          rollNumber: 'R3',
        },
        {
          fullName: 'P4',
          email: 'p4@example.com',
          phone: '9876543214',
          rollNumber: 'R4',
        },
        {
          fullName: 'P5',
          email: 'p5@example.com',
          phone: '9876543215',
          rollNumber: 'R5',
        },
      ],
    };

    const result = RegisterTeamSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
