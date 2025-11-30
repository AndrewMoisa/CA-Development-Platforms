import { Router } from 'express';
import authRoutes from './authRoutes';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use('/auth', authRoutes);

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Example protected route
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 */
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You have access to this protected route!' });
});

export default router;
