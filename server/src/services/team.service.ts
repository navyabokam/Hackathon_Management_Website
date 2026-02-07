import { Team, Payment, type ITeam } from '../models/index.js';
import { RegisterTeamInput } from '../schemas/index.js';
import { generateRegistrationId, generateTransactionRef } from '../utils/id-generator.js';
import { sendConfirmationEmail, sendRegistrationConfirmationEmail, sendRegistrationInitiatedEmail } from '../utils/email.js';
import { config } from '../config/index.js';

export async function checkDuplicateParticipants(
  input: RegisterTeamInput
): Promise<{ isDuplicate: boolean; field?: string; message?: string }> {
  // No duplicate checking - allow all registrations
  return { isDuplicate: false };
}

export async function createTeam(input: RegisterTeamInput): Promise<ITeam> {
  const registrationId = generateRegistrationId();
  const transactionRef = generateTransactionRef();

  // Create team with new structure
  const team = new Team({
    registrationId,
    teamName: input.teamName,
    collegeName: input.collegeName,
    teamSize: input.teamSize,
    participant1Name: input.participant1Name,
    participant1Email: input.participant1Email,
    leaderPhone: input.leaderPhone,
    participant2Name: input.participant2Name || '',
    participant2Email: input.participant2Email || '',
    participant3Name: input.participant3Name || '',
    participant3Email: input.participant3Email || '',
    participant4Name: input.participant4Name || '',
    participant4Email: input.participant4Email || '',
    utrId: input.utrId,
    paymentScreenshot: input.paymentScreenshot,
    confirmation: input.confirmation,
    status: 'PENDING_PAYMENT', // Registration initiated, payment pending verification
  });

  await team.save();

  // Create payment record
  const payment = new Payment({
    teamId: team._id,
    amount: config.paymentAmount,
    currency: 'INR',
    status: 'Pending', // Payment under verification
    transactionRef: input.utrId, // Use UTR as transaction ref
    provider: 'UPI',
  });

  await payment.save();

  // Link payment to team
  team.payment = payment._id;
  await team.save();

  // Send registration initiated email in background (non-blocking)
  // Email is sent asynchronously after response is returned to client
  sendRegistrationInitiatedEmail(team)
    .then(() => console.log('✉️ Registration email sent successfully'))
    .catch((emailError) => console.error('⚠️ Email sending failed:', emailError));

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

      // Send confirmation email in background (non-blocking)
      // Email is sent asynchronously after response is returned to client
      sendRegistrationConfirmationEmail(team)
        .then(() => console.log('✉️ Confirmation email sent successfully'))
        .catch((emailError) => console.error('⚠️ Email sending failed:', emailError));
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
  // Don't use lean() with populate - it breaks the populated relations
  // Just use regular queries for admin views where we need relations
  const teams = await Team.find()
    .populate('payment')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .exec();

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
    // Use index prefix match for registrationId (faster than regex scan)
    searchQuery.registrationId = { $regex: `^${query}`, $options: 'i' };
    return (await Team.find(searchQuery)
      .limit(20)
      .lean() // Don't instantiate full documents for list views
      .exec()) as unknown as ITeam[];
  } else if (searchType === 'teamName' || searchType === 'collegeName') {
    // Use MongoDB text search for fulltext search (20x faster than regex)
    return (await Team.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean() // Don't load relations for search list
      .exec()) as unknown as ITeam[];
  }

  return (await Team.find(searchQuery).limit(20).lean().exec()) as unknown as ITeam[];}