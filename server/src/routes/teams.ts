import { Router, Request, Response } from 'express';
import { RegisterTeamSchema } from '../schemas/index.js';
import * as teamService from '../services/team.service.js';

const router = Router();

// POST /api/teams - Create a new team
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Received team registration request body:', req.body);
    const input = RegisterTeamSchema.parse(req.body);

    // Check for duplicates with timeout protection
    const duplicateCheckPromise = teamService.checkDuplicateParticipants(input);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Duplicate check timeout')), 15000)
    );

    const duplicate = await Promise.race([duplicateCheckPromise, timeoutPromise]) as Awaited<ReturnType<typeof teamService.checkDuplicateParticipants>>;
    
    if (duplicate.isDuplicate) {
      let errorMessage = '';
      if (duplicate.field === 'team name') {
        errorMessage = duplicate.message || `Team name "${input.teamName}" is already taken. Please choose a different team name.`;
      } else if (duplicate.field === 'participant email') {
        errorMessage = 'This email is already registered. Please use a different email address.';
      } else if (duplicate.field === 'mobile number') {
        errorMessage = 'This mobile number is already registered. Please use a different phone number.';
      }
      res.status(409).json({
        error: errorMessage,
      });
      return;
    }

    const team = await teamService.createTeam(input);

    res.status(201).json({
      registrationId: team.registrationId,
      teamName: team.teamName,
      status: team.status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Duplicate check timeout') {
      console.error('Duplicate check timeout - server may be overloaded');
      res.status(503).json({ error: 'Service temporarily unavailable, please try again' });
    } else if (error instanceof Error) {
      console.error('Registration error:', error.message);
      // Don't check for "duplicate" in error message - just return the error as is
      res.status(400).json({ error: error.message });
    } else {
      console.error('Unknown registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// GET /api/teams/:registrationId - Get team by registration ID (public)
router.get('/:registrationId', async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const team = await teamService.getTeamByRegistrationId(registrationId);

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json({
      _id: team._id,
      registrationId: team.registrationId,
      teamName: team.teamName,
      collegeName: team.collegeName,
      teamSize: team.teamSize,
      status: team.status,
      verificationStatus: team.verificationStatus,
      participant1Email: team.participant1Email,
      participant1Name: team.participant1Name,
      leaderPhone: team.leaderPhone,
      paymentStatus: (team.payment as any)?.status,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
