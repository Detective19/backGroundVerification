import prisma from '../config/database';
import {
  CreateCandidateRequest,
  UpdateCandidateRequest,
  CandidateResponse,
  PaginatedResponse,
  PaginationParams,
  CandidateFilters,
} from '../types';

export class CandidateService {
  async createCandidate(data: CreateCandidateRequest): Promise<CandidateResponse> {
    const existingAadhaar = await prisma.candidate.findUnique({
      where: { aadhaarNumber: data.aadhaarNumber },
    });

    if (existingAadhaar) {
      throw new Error('Candidate with this Aadhaar number already exists');
    }

    const existingPAN = await prisma.candidate.findUnique({
      where: { panNumber: data.panNumber },
    });

    if (existingPAN) {
      throw new Error('Candidate with this PAN number already exists');
    }

    const candidate = await prisma.candidate.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        aadhaarNumber: data.aadhaarNumber,
        panNumber: data.panNumber,
        dob: new Date(data.dob),
        address: data.address,
        status: data.status || 'pending',
      },
    });

    return this.formatCandidate(candidate);
  }

  async getCandidates(
    pagination: PaginationParams,
    filters: CandidateFilters
  ): Promise<PaginatedResponse<CandidateResponse>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) {
      where.status = filters.status.toLowerCase();
    }

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { aadhaarNumber: { contains: filters.search, mode: 'insensitive' } },
        { panNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.candidate.count({ where }),
    ]);

    return {
      data: candidates.map((c) => this.formatCandidate(c)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getCandidateById(id: string): Promise<CandidateResponse> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return this.formatCandidate(candidate);
  }

  async updateCandidate(id: string, data: UpdateCandidateRequest): Promise<CandidateResponse> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    if (data.aadhaarNumber && data.aadhaarNumber !== candidate.aadhaarNumber) {
      const existingAadhaar = await prisma.candidate.findUnique({
        where: { aadhaarNumber: data.aadhaarNumber },
      });
      if (existingAadhaar) {
        throw new Error('Aadhaar number already in use');
      }
    }

    if (data.panNumber && data.panNumber !== candidate.panNumber) {
      const existingPAN = await prisma.candidate.findUnique({
        where: { panNumber: data.panNumber },
      });
      if (existingPAN) {
        throw new Error('PAN number already in use');
      }
    }

    const updateData: any = { ...data };
    if (data.dob) {
      updateData.dob = new Date(data.dob);
    }

    const updated = await prisma.candidate.update({
      where: { id },
      data: updateData,
    });

    return this.formatCandidate(updated);
  }

  async deleteCandidate(id: string): Promise<void> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    await prisma.candidate.delete({
      where: { id },
    });
  }

  private formatCandidate(candidate: any): CandidateResponse {
    return {
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      aadhaarNumber: candidate.aadhaarNumber,
      panNumber: candidate.panNumber,
      dob: candidate.dob.toISOString().split('T')[0],
      address: candidate.address,
      status: candidate.status,
      createdAt: candidate.createdAt.toISOString(),
      updatedAt: candidate.updatedAt.toISOString(),
    };
  }
}

export const candidateService = new CandidateService();
