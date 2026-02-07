import { Router, Response, Request } from 'express';
import * as teamService from '../services/team.service.js';

const router = Router();

// GET /api/admin/teams - List all teams (admin only - secret key required)
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    console.log(`📋 Admin teams request: limit=${limit}, skip=${skip}`);
    
    const result = await teamService.getAllTeams(limit, skip);
    
    console.log(`✅ Retrieved ${result.teams.length} teams, total=${result.total}`);

    res.json({
      teams: result.teams.map((team: any) => ({
        _id: team._id,
        registrationId: team.registrationId,
        teamName: team.teamName,
        collegeName: team.collegeName,
        teamSize: team.teamSize,
        status: team.status,
        verificationStatus: team.verificationStatus,
        paymentStatus: team.payment?.status || null,
        createdAt: team.createdAt,
      })),
      total: result.total,
      limit,
      skip,
    });
  } catch (error) {
    console.error('❌ Error loading teams:', error instanceof Error ? error.message : String(error));
    console.error('Full error stack:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/search/:type/:query - Search teams (admin only)
// Place this BEFORE /:id route so it matches first
router.get('/search/:type/:query', async (req: Request, res: Response) => {
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
router.get('/:id', async (req: Request, res: Response) => {
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
      participant1Name: team.participant1Name,
      participant1Email: team.participant1Email,
      leaderPhone: team.leaderPhone,
      participant2Name: team.participant2Name,
      participant2Email: team.participant2Email,
      participant3Name: team.participant3Name,
      participant3Email: team.participant3Email,
      participant4Name: team.participant4Name,
      participant4Email: team.participant4Email,
      utrId: team.utrId,
      paymentScreenshot: team.paymentScreenshot,
      paymentStatus: (team.payment as any)?.status,
      createdAt: team.createdAt,
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/teams/:id/verify - Toggle verification status (admin only)
router.patch('/:id/verify', async (req: Request, res: Response) => {
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
