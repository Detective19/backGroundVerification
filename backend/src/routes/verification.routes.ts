import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { verificationController } from '../controllers/verification.controller';

const router = Router();

// All verification routes require authentication
router.use(authMiddleware);

router.post('/verify', (req, res) => verificationController.verifyCandidateAsync(req, res));

router.get('/logs/:candidateId', (req, res) => verificationController.getVerificationLogs(req, res));

router.get('/latest/:candidateId', (req, res) => verificationController.getLatestVerification(req, res));

export default router;
