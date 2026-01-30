import { Router, Request, Response } from 'express';
import { RegisterTeamSchema } from '../schemas/index';
import * as teamService from '../services/team.service';

const router = Router();

// POST /api/teams - Create a new team
router.post('/', async (req: Request, res: Response) => {
  try {
    const input = RegisterTeamSchema.parse(req.body);

    // Check for duplicates
    const duplicate = await teamService.checkDuplicateParticipants(input);
    if (duplicate.isDuplicate) {
      res.status(409).json({
        error: `Duplicate ${duplicate.field}: A participant with this email/phone already exists`,
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
    if (error instanceof Error && error.message.includes('duplicate')) {
      res.status(409).json({ error: 'Team or participant already registered' });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
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
      participants: team.participants,
      leaderEmail: team.leaderEmail,
      paymentStatus: (team.payment as any)?.status,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
