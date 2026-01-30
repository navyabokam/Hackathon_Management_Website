import mongoose, { Schema, Document } from 'mongoose';

export interface IParticipant {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
}

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
  teamSize: number;
  participants: IParticipant[];
  leaderEmail: string;
  leaderPhone: string;
  payment?: mongoose.Types.ObjectId;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
  verificationStatus: 'Not Verified' | 'Verified';
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rollNumber: { type: String, required: true },
  },
  { _id: false }
);

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
      unique: true,
      required: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
      index: true,
    },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },
    participants: [ParticipantSchema],
    leaderEmail: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    leaderPhone: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
