import { Request, Response } from 'express';
import { candidateService } from '../services/candidate.service';
import {
  validateCreateCandidate,
  validateUpdateCandidate,
  validatePaginationParams,
  ValidationError,
} from '../validations/candidate.validation';
import { CandidateFilters } from '../types';

export class CandidateController {
  async createCandidate(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateCreateCandidate(req.body);
      const result = await candidateService.createCandidate(validatedData);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else if (error instanceof Error && (error.message.includes('already exists') || error.message.includes('already in use'))) {
        res.status(409).json({
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

  async getCandidates(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status, search } = req.query;

      const pagination = validatePaginationParams(page, limit);
      const filters: CandidateFilters = {};

      if (status) {
        filters.status = String(status);
      }
      if (search) {
        filters.search = String(search);
      }

      const result = await candidateService.getCandidates(pagination, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
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

  async getCandidateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Valid candidate ID is required',
        });
        return;
      }

      const result = await candidateService.getCandidateById(id);

      res.status(200).json({
        success: true,
        data: result,
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

  async updateCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Valid candidate ID is required',
        });
        return;
      }

      const validatedData = validateUpdateCandidate(req.body);
      const result = await candidateService.updateCandidate(id, validatedData);

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
      } else if (error instanceof Error && error.message.includes('already')) {
        res.status(409).json({
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

  async deleteCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Valid candidate ID is required',
        });
        return;
      }

      await candidateService.deleteCandidate(id);

      res.status(200).json({
        success: true,
        message: 'Candidate deleted successfully',
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
}

export const candidateController = new CandidateController();
