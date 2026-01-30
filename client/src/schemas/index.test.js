import { describe, it, expect } from 'vitest';
import { RegisterTeamSchema } from '../../src/schemas/index';
describe('Register Component Validation', () => {
    it('should validate correct team data', () => {
        const validData = {
            teamName: 'Innovators',
            collegeName: 'ABC Institute',
            leaderEmail: 'leader@college.com',
            leaderPhone: '9876543210',
            participants: [
                {
                    fullName: 'Alice',
                    email: 'alice@college.com',
                    phone: '9876543211',
                    rollNumber: 'A001',
                },
                {
                    fullName: 'Bob',
                    email: 'bob@college.com',
                    phone: '9876543212',
                    rollNumber: 'A002',
                },
            ],
        };
        const result = RegisterTeamSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });
    it('should require team name', () => {
        const invalidData = {
            teamName: '',
            collegeName: 'ABC Institute',
            leaderEmail: 'leader@college.com',
            leaderPhone: '9876543210',
            participants: [],
        };
        const result = RegisterTeamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
    it('should require at least one participant', () => {
        const invalidData = {
            teamName: 'Innovators',
            collegeName: 'ABC Institute',
            leaderEmail: 'leader@college.com',
            leaderPhone: '9876543210',
            participants: [],
        };
        const result = RegisterTeamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});
