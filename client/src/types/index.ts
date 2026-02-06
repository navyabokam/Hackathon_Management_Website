export interface Team {
  _id: string;
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
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
  verificationStatus: 'Not Verified' | 'Verified';
  paymentStatus?: 'Success' | 'Failed' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  teamId: string;
  amount: number;
  currency: string;
  status: 'Success' | 'Failed' | 'Pending';
  transactionRef: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  role: 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface RegisterTeamInput {
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
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
