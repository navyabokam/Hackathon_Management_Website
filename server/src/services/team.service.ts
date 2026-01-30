import { Team, Payment, type ITeam } from '../models/index';
import { RegisterTeamInput } from '../schemas/index';
import { generateRegistrationId, generateTransactionRef } from '../utils/id-generator';
import { sendConfirmationEmail } from '../utils/email';
import { config } from '../config/index';

export async function checkDuplicateParticipants(
  input: RegisterTeamInput
): Promise<{ isDuplicate: boolean; field?: string }> {
  const emails = input.participants.map((p) => p.email);
  const phones = input.participants.map((p) => p.phone);

  const existingParticipants = await Team.findOne({
    $or: [
      { 'participants.email': { $in: emails } },
      { 'participants.phone': { $in: phones } },
    ],
  });

  if (existingParticipants) {
    return { isDuplicate: true, field: 'participants' };
  }

  // Check leader email/phone
  const existingLeader = await Team.findOne({
    $or: [{ leaderEmail: input.leaderEmail }, { leaderPhone: input.leaderPhone }],
  });

  if (existingLeader) {
    return {
      isDuplicate: true,
      field: 'leaderEmail/leaderPhone',
    };
  }

  return { isDuplicate: false };
}

export async function createTeam(input: RegisterTeamInput): Promise<ITeam> {
  const registrationId = generateRegistrationId();
  const transactionRef = generateTransactionRef();

  // Create team
  const team = new Team({
    registrationId,
    teamName: input.teamName,
    collegeName: input.collegeName,
    teamSize: input.participants.length,
    participants: input.participants,
    leaderEmail: input.leaderEmail,
    leaderPhone: input.leaderPhone,
    status: 'PENDING_PAYMENT',
  });

  await team.save();

  // Create payment record
  const payment = new Payment({
    teamId: team._id,
    amount: config.paymentAmount,
    currency: 'INR',
    status: 'Pending',
    transactionRef,
    provider: 'mock',
  });

  await payment.save();

  // Link payment to team
  team.payment = payment._id;
  await team.save();

  return team;
}

export async function getTeamByRegistrationId(registrationId: string): Promise<ITeam | null> {
  return Team.findOne({ registrationId }).populate('payment');
}

export async function getTeamById(teamId: string): Promise<ITeam | null> {
  return Team.findById(teamId).populate('payment');
}

export async function confirmPayment(registrationId: string): Promise<ITeam> {
  const team = await Team.findOne({ registrationId }).populate('payment');

  if (!team) {
    throw new Error('Team not found');
  }

  if (team.payment) {
    const payment = await Payment.findByIdAndUpdate(
      team.payment._id,
      { status: 'Success' },
      { new: true }
    );

    if (payment) {
      team.status = 'CONFIRMED';
      await team.save();

      // Send confirmation email
      const memberEmails = team.participants.map((p) => p.fullName);
      try {
        await sendConfirmationEmail(
          team.leaderEmail,
          team.teamName,
          registrationId,
          memberEmails
        );
      } catch (emailError) {
        console.error('Email sending failed, but payment confirmed:', emailError);
        // Don't throw - payment is already confirmed
      }
    }
  }

  return team;
}

export async function failPayment(registrationId: string): Promise<ITeam> {
  const team = await Team.findOne({ registrationId }).populate('payment');

  if (!team) {
    throw new Error('Team not found');
  }

  if (team.payment) {
    await Payment.findByIdAndUpdate(team.payment._id, { status: 'Failed' }, { new: true });
  }

  return team;
}

export async function getAllTeams(
  limit = 50,
  skip = 0
): Promise<{ teams: ITeam[]; total: number }> {
  const teams = await Team.find()
    .populate('payment')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Team.countDocuments();

  return { teams, total };
}

export async function toggleTeamVerification(teamId: string): Promise<ITeam> {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error('Team not found');
  }

  team.verificationStatus = team.verificationStatus === 'Verified' ? 'Not Verified' : 'Verified';
  await team.save();

  return team;
}

export async function searchTeams(
  query: string,
  searchType: 'registrationId' | 'teamName' | 'collegeName'
): Promise<ITeam[]> {
  const searchQuery: Record<string, unknown> = {};

  if (searchType === 'registrationId') {
    searchQuery.registrationId = { $regex: query, $options: 'i' };
  } else if (searchType === 'teamName') {
    searchQuery.teamName = { $regex: query, $options: 'i' };
  } else if (searchType === 'collegeName') {
    searchQuery.collegeName = { $regex: query, $options: 'i' };
  }

  return Team.find(searchQuery).populate('payment').limit(20);
}
