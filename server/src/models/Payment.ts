import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  teamId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'Success' | 'Failed' | 'Pending';
  transactionRef: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Pending',
      index: true,
    },
    transactionRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      default: 'mock',
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
