import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { validateRegister, validateLogin, ValidationError } from '../validations/auth.validation';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateRegister(req.body);
      const result = await authService.register(validatedData);
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
      } else if (error instanceof Error && error.message.includes('already exists')) {
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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateLogin(req.body);
      const result = await authService.login(validatedData);
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
      } else if (error instanceof Error && error.message.includes('Invalid')) {
        res.status(401).json({
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

export const authController = new AuthController();
