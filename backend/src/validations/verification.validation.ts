export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const AADHAAR_REGEX = /^\d{12}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const validateAadhaar = (aadhaarNumber: string): boolean => {
  return AADHAAR_REGEX.test(aadhaarNumber);
};

export const validatePAN = (panNumber: string): boolean => {
  return PAN_REGEX.test(panNumber.toUpperCase());
};

export const validateVerifyRequest = (data: unknown) => {
  const req = data as Record<string, unknown>;

  if (!req.candidateId || typeof req.candidateId !== 'string' || req.candidateId.trim().length === 0) {
    throw new ValidationError('Valid candidate ID is required');
  }

  return {
    candidateId: req.candidateId as string,
  };
};
