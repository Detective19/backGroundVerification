import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AuthPayload } from '../types';

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry as any,
  });
};

export const verifyToken = (token: string): AuthPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
