import prisma from '../config/database';
import {
  AadhaarVerifyResponse,
  PANVerifyResponse,
  VerificationResponse,
} from '../types';
import { mockAadhaarVerify, mockPANVerify } from '../utils/mock-api.utils';

export class VerificationService {
  async verifyCandidateAsync(candidateId: string): Promise<VerificationResponse> {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const aadhaarResponse = await mockAadhaarVerify(
      candidate.aadhaarNumber,
      candidate.fullName,
      candidate.dob.toISOString().split('T')[0]
    );

    const panResponse = await mockPANVerify(candidate.panNumber);

    const aadhaarVerified = aadhaarResponse.status === 'verified';
    const panVerified = panResponse.status === 'verified';

    let overallStatus = 'FAILED';
    if (aadhaarVerified && panVerified) {
      overallStatus = 'VERIFIED';
    } else if (aadhaarVerified || panVerified) {
      overallStatus = 'PARTIAL';
    }

    const verificationLog = await prisma.verificationLog.create({
      data: {
        candidateId,
        aadhaarStatus: aadhaarResponse.status,
        aadhaarResponse: aadhaarResponse as any,
        panStatus: panResponse.status,
        panResponse: panResponse as any,
        overallStatus,
        nameMatch: aadhaarResponse.nameMatch,
        dobMatch: aadhaarResponse.dobMatch,
        panStatusActive: panResponse.panStatus === 'active',
      },
    });

    return {
      candidateId,
      overallStatus,
      aadhaarStatus: aadhaarResponse.status,
      panStatus: panResponse.status,
      details: {
        nameMatch: aadhaarResponse.nameMatch,
        dobMatch: aadhaarResponse.dobMatch,
        panStatusActive: panResponse.panStatus === 'active',
      },
      logs: {
        aadhaarResponse,
        panResponse,
      },
    };
  }

  async getVerificationLogs(candidateId: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const logs = await prisma.verificationLog.findMany({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((log) => ({
      id: log.id,
      candidateId: log.candidateId,
      aadhaarStatus: log.aadhaarStatus,
      panStatus: log.panStatus,
      overallStatus: log.overallStatus,
      nameMatch: log.nameMatch,
      dobMatch: log.dobMatch,
      panStatusActive: log.panStatusActive,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    }));
  }

  async getLatestVerification(candidateId: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const latestLog = await prisma.verificationLog.findFirst({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestLog) {
      throw new Error('No verification logs found for this candidate');
    }

    return {
      id: latestLog.id,
      candidateId: latestLog.candidateId,
      aadhaarStatus: latestLog.aadhaarStatus,
      panStatus: latestLog.panStatus,
      overallStatus: latestLog.overallStatus,
      nameMatch: latestLog.nameMatch,
      dobMatch: latestLog.dobMatch,
      panStatusActive: latestLog.panStatusActive,
      aadhaarResponse: latestLog.aadhaarResponse,
      panResponse: latestLog.panResponse,
      createdAt: latestLog.createdAt.toISOString(),
      updatedAt: latestLog.updatedAt.toISOString(),
    };
  }
}

export const verificationService = new VerificationService();
