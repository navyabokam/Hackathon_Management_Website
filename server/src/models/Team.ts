import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentRef {
  teamId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'Success' | 'Failed' | 'Pending';
  transactionRef: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam extends Document {
  registrationId: string;
  teamName: string;
  collegeName: string;
  teamSize: string;
  participant1Name: string;
  participant1Email: string;
  leaderPhone: string;
  participant2Name?: string;
  participant2Email?: string;
  participant3Name?: string;
  participant3Email?: string;
  participant4Name?: string;
  participant4Email?: string;
  utrId: string;
  paymentScreenshot: string;
  confirmation: boolean;
  payment?: mongoose.Types.ObjectId;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
  verificationStatus: 'Not Verified' | 'Verified';
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
      index: true,
    },
    teamSize: {
      type: String,
      required: true,
    },
    participant1Name: {
      type: String,
      required: true,
    },
    participant1Email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true,
    },
    leaderPhone: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true,
    },
    participant2Name: {
      type: String,
      default: '',
    },
    participant2Email: {
      type: String,
      default: '',
    },
    participant3Name: {
      type: String,
      default: '',
    },
    participant3Email: {
      type: String,
      default: '',
    },
    participant4Name: {
      type: String,
      default: '',
    },
    participant4Email: {
      type: String,
      default: '',
    },
    utrId: {
      type: String,
      required: true,
    },
    paymentScreenshot: {
      type: String,
      required: true,
    },
    confirmation: {
      type: Boolean,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Not Verified', 'Verified'],
      default: 'Not Verified',
    },
  },
  { timestamps: true }
);

// Add text index for efficient search
TeamSchema.index({ teamName: 'text', collegeName: 'text' });
// Add compound index for common queries
TeamSchema.index({ status: 1, createdAt: -1 });

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
