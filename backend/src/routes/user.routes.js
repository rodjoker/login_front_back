import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateUserSchema } from '../validators/user.validator.js';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = Router();

// Todo /api/users requiere estar autenticado.
router.use(protect);

router.get('/', listUsers);
router.get('/:id', getUser);
router.patch('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
