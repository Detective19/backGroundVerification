import { RegisterRequest, LoginRequest } from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateRegister = (data: unknown): RegisterRequest => {
  const req = data as Record<string, unknown>;

  if (!req.name || typeof req.name !== 'string' || req.name.trim().length === 0) {
    throw new ValidationError('Name is required and must be a non-empty string');
  }

  if (!req.email || typeof req.email !== 'string' || !isValidEmail(req.email)) {
    throw new ValidationError('Valid email is required');
  }

  if (!req.password || typeof req.password !== 'string' || req.password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  return {
    name: req.name.trim(),
    email: req.email.trim().toLowerCase(),
    password: req.password,
  };
};

export const validateLogin = (data: unknown): LoginRequest => {
  const req = data as Record<string, unknown>;

  if (!req.email || typeof req.email !== 'string' || !isValidEmail(req.email)) {
    throw new ValidationError('Valid email is required');
  }

  if (!req.password || typeof req.password !== 'string') {
    throw new ValidationError('Password is required');
  }

  return {
    email: req.email.trim().toLowerCase(),
    password: req.password,
  };
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
