import { z } from 'zod';

export const RegisterTeamSchema = z.object({
  teamName: z.string().min(1, 'Team name is required').max(100, 'Team name too long'),
  collegeName: z.string().min(1, 'College/University name is required').max(200, 'College name too long'),
  teamSize: z.string().min(1, 'Team size is required'),
  participant1Name: z.string().min(1, 'Team leader full name is required'),
  participant1Email: z.string().email('Team leader email is required'),
  leaderPhone: z.string().regex(/^\d{10}$/, 'Mobile must be exactly 10 digits'),
  participant2Name: z.string().default(''),
  participant2Email: z.string().email('Invalid email').or(z.literal('')).default(''),
  participant3Name: z.string().default(''),
  participant3Email: z.string().email('Invalid email').or(z.literal('')).default(''),
  participant4Name: z.string().default(''),
  participant4Email: z.string().email('Invalid email').or(z.literal('')).default(''),
  utrId: z.string().min(1, 'UTR ID is required'),
  paymentScreenshot: z.string().url('Invalid Google Drive link').min(1, 'Payment screenshot link is required'),
  confirmation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the registration details',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterTeamInput = z.infer<typeof RegisterTeamSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
