import { z } from 'zod';

const ParticipantSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  rollNumber: z.string().min(1, 'Roll number is required'),
});

export const RegisterTeamSchema = z.object({
  teamName: z.string().min(1, 'Team name is required').max(100, 'Team name too long'),
  collegeName: z.string().min(1, 'College name is required').max(200, 'College name too long'),
  leaderEmail: z.string().email('Invalid leader email'),
  leaderPhone: z.string().regex(/^\d{10,15}$/, 'Leader phone must be 10-15 digits'),
  participants: z
    .array(ParticipantSchema)
    .min(1, 'At least one participant is required')
    .max(4, 'Maximum 4 participants allowed'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterTeamInput = z.infer<typeof RegisterTeamSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
