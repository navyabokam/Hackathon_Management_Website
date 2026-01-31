import { Router, Response } from 'express';
import * as teamService from '../services/team.service.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/search/:type/:query - Search teams (admin only)
router.get('/:type/:query', authMiddleware, async (req: AuthRequest, res: Response) => {
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

export default router;
