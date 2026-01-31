import { Router, Response } from 'express';
import { PaymentConfirmSchema } from '../schemas/index.js';
import * as teamService from '../services/team.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateTransactionRef } from '../utils/id-generator.js';
import { Payment } from '../models/index.js';
import { config } from '../config/index.js';

const router = Router();

// POST /api/payments/initiate - Initiate payment
router.post('/initiate', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId } = req.body;

    const team = await teamService.getTeamByRegistrationId(registrationId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    if (!team.payment) {
      res.status(400).json({ error: 'Payment not initialized' });
      return;
    }

    const payment = await Payment.findById(team.payment);
    if (!payment) {
      res.status(400).json({ error: 'Payment record not found' });
      return;
    }

    // Return mock payment session
    res.json({
      sessionId: payment._id,
      amount: payment.amount,
      currency: payment.currency,
      registrationId,
      teamName: team.teamName,
      mockPaymentUrl: `/payment?id=${payment._id}&mock=true`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/confirm - Confirm payment
router.post('/confirm', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId, transactionRef } = PaymentConfirmSchema.parse(req.body);

    // Simulate success - in real system, verify with payment gateway
    const team = await teamService.confirmPayment(registrationId);

    res.json({
      success: true,
      registrationId: team.registrationId,
      status: team.status,
      message: 'Payment confirmed successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// POST /api/payments/fail - Mark payment as failed
router.post('/fail', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId } = req.body;

    const team = await teamService.failPayment(registrationId);

    res.json({
      success: true,
      registrationId: team.registrationId,
      status: team.status,
      message: 'Payment marked as failed',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
