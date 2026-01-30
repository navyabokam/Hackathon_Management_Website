import { Router, Response } from 'express';
import * as XLSX from 'xlsx';
import * as teamService from '../services/team.service';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/admin/export/excel - Export all teams to Excel (admin only)
router.get('/excel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { teams } = await teamService.getAllTeams(10000, 0); // Get all teams (up to 10000)

    // Prepare data for Excel
    const excelData = teams.map((team) => ({
      'Registration ID': team.registrationId,
      'Team Name': team.teamName,
      'College Name': team.collegeName,
      'Team Size': team.teamSize,
      'Status': team.status,
      'Verification Status': team.verificationStatus,
      'Payment Status': (team.payment as any)?.status || 'N/A',
      'Created At': new Date(team.createdAt).toLocaleDateString(),
      'Participants': team.participants.map((p) => `${p.fullName} (${p.email})`).join('; '),
      'Leader Email': team.leaderEmail,
    }));

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
      { wch: 12 }, // Created At
      { wch: 40 }, // Participants
      { wch: 20 }, // Leader Email
    ];
    ws['!cols'] = colWidths;

    // Generate Excel file
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="teams_${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export teams' });
  }
});

export default router;
