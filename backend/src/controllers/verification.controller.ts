import { Request, Response } from 'express';
import { verificationService } from '../services/verification.service';
import { validateVerifyRequest, ValidationError } from '../validations/verification.validation';

export class VerificationController {
  async verifyCandidateAsync(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateVerifyRequest(req.body);
      const result = await verificationService.verifyCandidateAsync(validatedData.candidateId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else if (error instanceof Error && error.message === 'Candidate not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async getVerificationLogs(req: Request, res: Response): Promise<void> {
    try {
      const { candidateId } = req.params;

      if (!candidateId || typeof candidateId !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Valid candidate ID is required',
        });
        return;
      }

      const logs = await verificationService.getVerificationLogs(candidateId);

      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Candidate not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async getLatestVerification(req: Request, res: Response): Promise<void> {
    try {
      const { candidateId } = req.params;

      if (!candidateId || typeof candidateId !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Valid candidate ID is required',
        });
        return;
      }

      const log = await verificationService.getLatestVerification(candidateId);

      res.status(200).json({
        success: true,
        data: log,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Candidate not found' || error.message.includes('No verification'))
      ) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }
}

export const verificationController = new VerificationController();
