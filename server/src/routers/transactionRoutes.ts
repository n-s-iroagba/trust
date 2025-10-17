import { Router } from 'express';
import { TransactionRequestController } from '../controllers/TransactionRequestController';
import { authenticate, requireAdmin, requireClient } from '../middlewares/auth';
import { validate } from '../middlewares/validation/validationMiddleware';
import { 
  TransactionRequestCreationSchema,
  UpdateStatusSchema,
  TransactionRequestIdSchema,
  ClientWalletIdParamSchema,
  StatusParamSchema
} from '../middlewares/validation/schemas';

const router = Router();
const transactionRequestController = new TransactionRequestController();

// Client routes
router.post(
  '/',
  authenticate,
  requireClient,
  validate(TransactionRequestCreationSchema),
  transactionRequestController.createTransactionRequest
);

router.get(
  '/client-wallet/:clientWalletId',
  authenticate,
  validate(ClientWalletIdParamSchema),
  transactionRequestController.getTransactionRequestsByClientWalletId
);

// Admin routes
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  validate(TransactionRequestIdSchema),
  validate(UpdateStatusSchema),
  transactionRequestController.updateTransactionRequestStatus
);

router.get(
  '/status/:status',
  authenticate,
  requireAdmin,
  validate(StatusParamSchema),
  transactionRequestController.getTransactionRequestsByStatus
);

router.get(
  '/:id',
  authenticate,
  validate(TransactionRequestIdSchema),
  transactionRequestController.getTransactionRequestById
);

export default router;