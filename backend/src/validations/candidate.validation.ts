import { CreateCandidateRequest, UpdateCandidateRequest } from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const isValidAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar);
};

const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'approved', 'rejected', 'review'];
  return validStatuses.includes(status.toLowerCase());
};

export const validateCreateCandidate = (data: unknown): CreateCandidateRequest => {
  const req = data as Record<string, unknown>;

  if (!req.fullName || typeof req.fullName !== 'string' || req.fullName.trim().length === 0) {
    throw new ValidationError('Full name is required and must be a non-empty string');
  }

  if (!req.email || typeof req.email !== 'string' || !isValidEmail(req.email as string)) {
    throw new ValidationError('Valid email is required');
  }

  if (!req.phone || typeof req.phone !== 'string' || !isValidPhone(req.phone as string)) {
    throw new ValidationError('Phone number must be 10 digits');
  }

  if (!req.aadhaarNumber || typeof req.aadhaarNumber !== 'string' || !isValidAadhaar(req.aadhaarNumber as string)) {
    throw new ValidationError('Aadhaar number must be 12 digits');
  }

  if (!req.panNumber || typeof req.panNumber !== 'string' || !isValidPAN((req.panNumber as string).toUpperCase())) {
    throw new ValidationError('Invalid PAN number format');
  }

  if (!req.dob || typeof req.dob !== 'string' || !isValidDate(req.dob as string)) {
    throw new ValidationError('Valid date of birth is required (YYYY-MM-DD)');
  }

  if (!req.address || typeof req.address !== 'string' || req.address.trim().length === 0) {
    throw new ValidationError('Address is required');
  }

  if (req.status && !isValidStatus(req.status as string)) {
    throw new ValidationError('Status must be one of: pending, approved, rejected, review');
  }

  return {
    fullName: (req.fullName as string).trim(),
    email: (req.email as string).trim().toLowerCase(),
    phone: req.phone as string,
    aadhaarNumber: req.aadhaarNumber as string,
    panNumber: (req.panNumber as string).toUpperCase(),
    dob: req.dob as string,
    address: (req.address as string).trim(),
    status: req.status ? (req.status as string).toLowerCase() : 'pending',
  };
};

export const validateUpdateCandidate = (data: unknown): UpdateCandidateRequest => {
  const req = data as Record<string, unknown>;
  const result: UpdateCandidateRequest = {};

  if (req.fullName !== undefined) {
    if (typeof req.fullName !== 'string' || req.fullName.trim().length === 0) {
      throw new ValidationError('Full name must be a non-empty string');
    }
    result.fullName = (req.fullName as string).trim();
  }

  if (req.email !== undefined) {
    if (typeof req.email !== 'string' || !isValidEmail(req.email as string)) {
      throw new ValidationError('Valid email is required');
    }
    result.email = (req.email as string).trim().toLowerCase();
  }

  if (req.phone !== undefined) {
    if (typeof req.phone !== 'string' || !isValidPhone(req.phone as string)) {
      throw new ValidationError('Phone number must be 10 digits');
    }
    result.phone = req.phone as string;
  }

  if (req.aadhaarNumber !== undefined) {
    if (typeof req.aadhaarNumber !== 'string' || !isValidAadhaar(req.aadhaarNumber as string)) {
      throw new ValidationError('Aadhaar number must be 12 digits');
    }
    result.aadhaarNumber = req.aadhaarNumber as string;
  }

  if (req.panNumber !== undefined) {
    if (typeof req.panNumber !== 'string' || !isValidPAN((req.panNumber as string).toUpperCase())) {
      throw new ValidationError('Invalid PAN number format');
    }
    result.panNumber = (req.panNumber as string).toUpperCase();
  }

  if (req.dob !== undefined) {
    if (typeof req.dob !== 'string' || !isValidDate(req.dob as string)) {
      throw new ValidationError('Valid date of birth is required (YYYY-MM-DD)');
    }
    result.dob = req.dob as string;
  }

  if (req.address !== undefined) {
    if (typeof req.address !== 'string' || req.address.trim().length === 0) {
      throw new ValidationError('Address must be a non-empty string');
    }
    result.address = (req.address as string).trim();
  }

  if (req.status !== undefined) {
    if (typeof req.status !== 'string' || !isValidStatus(req.status as string)) {
      throw new ValidationError('Status must be one of: pending, approved, rejected, review');
    }
    result.status = (req.status as string).toLowerCase();
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError('At least one field must be provided for update');
  }

  return result;
};

export const validatePaginationParams = (page: unknown, limit: unknown) => {
  const pageNum = parseInt(String(page)) || 1;
  const limitNum = parseInt(String(limit)) || 10;

  if (pageNum < 1) {
    throw new ValidationError('Page must be greater than 0');
  }

  if (limitNum < 1 || limitNum > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }

  return { page: pageNum, limit: limitNum };
};
