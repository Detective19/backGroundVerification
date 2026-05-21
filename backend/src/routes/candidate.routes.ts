import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { candidateController } from '../controllers/candidate.controller';

const router = Router();

// All candidate routes require authentication
router.use(authMiddleware);

router.post('/', (req, res) => candidateController.createCandidate(req, res));

router.get('/', (req, res) => candidateController.getCandidates(req, res));

router.get('/:id', (req, res) => candidateController.getCandidateById(req, res));

router.put('/:id', (req, res) => candidateController.updateCandidate(req, res));

router.delete('/:id', (req, res) => candidateController.deleteCandidate(req, res));

export default router;
