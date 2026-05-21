import { Router, Request, Response } from 'express';
import { mockAadhaarVerify, mockPANVerify } from '../utils/mock-api.utils';
import { validateAadhaar, validatePAN, ValidationError } from '../validations/verification.validation';

const router = Router();

// Mock Aadhaar Verification API
router.post('/aadhaar/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { aadhaarNumber, fullName, dob } = req.body;

    if (!aadhaarNumber || typeof aadhaarNumber !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Aadhaar number is required',
      });
      return;
    }

    if (!validateAadhaar(aadhaarNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid Aadhaar number format (must be 12 digits)',
      });
      return;
    }

    if (!fullName || typeof fullName !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Full name is required',
      });
      return;
    }

    if (!dob || typeof dob !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Date of birth is required',
      });
      return;
    }

    const result = await mockAadhaarVerify(aadhaarNumber, fullName, dob);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Mock PAN Verification API
router.post('/pan/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { panNumber } = req.body;

    if (!panNumber || typeof panNumber !== 'string') {
      res.status(400).json({
        success: false,
        error: 'PAN number is required',
      });
      return;
    }

    if (!validatePAN(panNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid PAN number format (e.g., ABCDE1234F)',
      });
      return;
    }

    const result = await mockPANVerify(panNumber);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
