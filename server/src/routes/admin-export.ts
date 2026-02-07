import { Router, Response, Request } from 'express';
import * as XLSX from 'xlsx';
import * as teamService from '../services/team.service.js';
import { Team, type ITeam } from '../models/index.js';

const router = Router();

// GET /api/admin/export/excel - Export all teams to Excel (admin only - secret key required)
router.get('/excel', async (req: Request, res: Response) => {
  try {
    // Use lean() for faster query (don't instantiate full documents)
    const teams = (await Team.find()
      .populate('payment', 'status')  // Only fetch status field from payment
      .lean() // 3x faster than regular queries
      .sort({ createdAt: -1 })
      .limit(10000)
      .exec()) as unknown as ITeam[];

    console.log(`📊 Exporting ${teams.length} teams to Excel...`);
    
    // Prepare data for Excel
    const excelData = teams.map((team: ITeam) => {
      // Collect all participants
      const participantList = [
        team.participant1Name && team.participant1Email ? `${team.participant1Name} (${team.participant1Email})` : null,
        team.participant2Name && team.participant2Email ? `${team.participant2Name} (${team.participant2Email})` : null,
        team.participant3Name && team.participant3Email ? `${team.participant3Name} (${team.participant3Email})` : null,
        team.participant4Name && team.participant4Email ? `${team.participant4Name} (${team.participant4Email})` : null,
      ].filter((p) => p !== null).join('; ');

      return {
        'Registration ID': team.registrationId,
        'Team Name': team.teamName,
        'College Name': team.collegeName,
        'Team Size': team.teamSize,
        'Status': team.status,
        'Verification Status': team.verificationStatus,
        'Payment Status': (team.payment as any)?.status || 'N/A',
        'UTR ID': team.utrId,
        'Created At': new Date(team.createdAt).toLocaleDateString(),
        'Participants': participantList,
        'Leader Email': team.participant1Email,
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teams');

    // Set column widths for better readability
    const colWidths = [
      { wch: 15 }, // Registration ID
      { wch: 20 }, // Team Name
      { wch: 20 }, // College Name
      { wch: 10 }, // Team Size
      { wch: 15 }, // Status
      { wch: 18 }, // Verification Status
      { wch: 15 }, // Payment Status
      { wch: 20 }, // UTR ID
      { wch: 12 }, // Created At
      { wch: 40 }, // Participants
      { wch: 20 }, // Leader Email
    ];
    ws['!cols'] = colWidths;

    // Generate Excel file
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
    console.log(`✅ Excel file generated successfully (${buffer.length} bytes)`);

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="teams_${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ Export error:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to export teams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
