export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  aadhaar: string
  pan: string
  status: 'pending' | 'verified' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface VerificationLog {
  id: string
  candidateId: string
  stage: string
  status: 'pending' | 'completed' | 'failed'
  result?: string
  error?: string
  timestamp: string
}

export interface DashboardStats {
  totalCandidates: number
  verified: number
  failed: number
  pending: number
}

export interface AuthToken {
  access_token: string
  token_type: string
}

export interface User {
  id: string
  name: string
  email: string
}
