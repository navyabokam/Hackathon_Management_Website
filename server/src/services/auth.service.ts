import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser, type IAdminUser } from '../models/index.js';
import { config } from '../config/index.js';

export async function createAdminUser(email: string, password: string): Promise<IAdminUser> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = new AdminUser({
    email,
    passwordHash,
    role: 'admin',
  });

  await admin.save();
  return admin;
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const admin = await AdminUser.findOne({ email });

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: admin._id, email: admin.email }, config.jwtSecret, {
    expiresIn: '24h',
  });

  return token;
}

export async function verifyToken(token: string): Promise<{ id: string; email: string }> {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function getAdminByEmail(email: string): Promise<IAdminUser | null> {
  return AdminUser.findOne({ email });
}
