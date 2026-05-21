import { AadhaarVerifyResponse, PANVerifyResponse } from '../types';

export const mockAadhaarVerify = async (
  aadhaarNumber: string,
  fullName: string,
  dob: string
): Promise<AadhaarVerifyResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock verification logic
  const nameMatch = fullName.length > 0;
  const dobMatch = dob.match(/^\d{4}-\d{2}-\d{2}$/) !== null;

  return {
    status: nameMatch && dobMatch ? 'verified' : 'failed',
    nameMatch,
    dobMatch,
  };
};

export const mockPANVerify = async (panNumber: string): Promise<PANVerifyResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock verification logic - PAN format check
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isPanValid = panRegex.test(panNumber.toUpperCase());

  return {
    status: isPanValid ? 'verified' : 'failed',
    panStatus: isPanValid ? 'active' : 'inactive',
  };
};
