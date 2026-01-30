import { Router, Response } from 'express';
import * as teamService from '../services/team.service';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/admin/teams - List all teams (admin only)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const { teams, total } = await teamService.getAllTeams(limit, skip);

    res.json({
      teams: teams.map((team) => ({
        _id: team._id,
        registrationId: team.registrationId,
        teamName: team.teamName,
        collegeName: team.collegeName,
        teamSize: team.teamSize,
        status: team.status,
        verificationStatus: team.verificationStatus,
        paymentStatus: (team.payment as any)?.status,
        createdAt: team.createdAt,
      })),
      total,
      limit,
      skip,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/search/:type/:query - Search teams (admin only)
// Place this BEFORE /:id route so it matches first
router.get('/search/:type/:query', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, query } = req.params;

    if (!['registrationId', 'teamName', 'collegeName'].includes(type)) {
      res.status(400).json({ error: 'Invalid search type' });
      return;
    }

    const teams = await teamService.searchTeams(
      query,
      type as 'registrationId' | 'teamName' | 'collegeName'
    );

    res.json({
      teams: teams.map((team) => ({
        _id: team._id,
        registrationId: team.registrationId,
        teamName: team.teamName,
        collegeName: team.collegeName,
        status: team.status,
        verificationStatus: team.verificationStatus,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/teams/:id - Get team details (admin only)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const team = await teamService.getTeamById(id);

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
      createdAt: team.createdAt,
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/teams/:id/verify - Toggle verification status (admin only)
router.patch('/:id/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const team = await teamService.toggleTeamVerification(id);

    res.json({
      _id: team._id,
      registrationId: team.registrationId,
      teamName: team.teamName,
      verificationStatus: team.verificationStatus,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: 'Team not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
