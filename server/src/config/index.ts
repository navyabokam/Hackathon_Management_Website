import dotenv from 'dotenv';

dotenv.config();

const clientOriginStr = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const clientOrigins = clientOriginStr.split(',').map(origin => origin.trim());

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  clientOrigin: clientOrigins,
  teamMaxSize: parseInt(process.env.TEAM_MAX_SIZE || '4', 10),
  paymentAmount: parseInt(process.env.PAYMENT_AMOUNT || '500', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@hackathon.local',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
  },
};
