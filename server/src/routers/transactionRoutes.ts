import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
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
const transactionController = new TransactionController();

router.get('/client-wallet/:clientWalletId',transactionController.getTransactionsByClientWalletId)
router.put('/:id',transactionController.updateTransaction)
router.put('/status/:id',transactionController.updateTransactionStatus)
router.get('/pending',transactionController.getPending)

export default router;