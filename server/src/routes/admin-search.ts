import { Router, Response, Request } from 'express';
import * as teamService from '../services/team.service.js';

const router = Router();

// GET /api/admin/search/:type/:query - Search teams (admin only - secret key required)
router.get('/:type/:query', async (req: Request, res: Response) => {
  try {
    const { type, query } = req.params;

    console.log(`🔍 Search request: type=${type}, query=${query}`);

    if (!['registrationId', 'teamName', 'collegeName'].includes(type)) {
      res.status(400).json({ error: 'Invalid search type' });
      return;
    }

    const teams = await teamService.searchTeams(
      query,
      type as 'registrationId' | 'teamName' | 'collegeName'
    );

    console.log(`✅ Found ${teams.length} teams matching search`);

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
    console.error('❌ Search error:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
