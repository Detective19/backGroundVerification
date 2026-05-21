export interface AuthPayload {
  id: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface CreateCandidateRequest {
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
  status?: string;
}

export interface UpdateCandidateRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  dob?: string;
  address?: string;
  status?: string;
}

export interface CandidateResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CandidateFilters {
  status?: string;
  search?: string;
}

export interface AadhaarVerifyRequest {
  aadhaarNumber: string;
  fullName: string;
  dob: string;
}

export interface AadhaarVerifyResponse {
  status: string;
  nameMatch: boolean;
  dobMatch: boolean;
}

export interface PANVerifyRequest {
  panNumber: string;
}

export interface PANVerifyResponse {
  status: string;
  panStatus: string;
}

export interface VerifyRequest {
  candidateId: string;
}

export interface VerificationResponse {
  candidateId: string;
  overallStatus: string;
  aadhaarStatus?: string;
  panStatus?: string;
  details: {
    nameMatch?: boolean;
    dobMatch?: boolean;
    panStatusActive?: boolean;
  };
  logs: {
    aadhaarResponse?: AadhaarVerifyResponse;
    panResponse?: PANVerifyResponse;
  };
}
