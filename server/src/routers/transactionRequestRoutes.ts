import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation/validationMiddleware';
import { 
  TransactionCreationSchema,
  TransactionIdSchema,
  ClientWalletIdParamSchema,
  AdminWalletIdParamSchema
} from '../middlewares/validation/schemas';

const router = Router();
const transactionController = new TransactionController();

// All routes require admin authentication
router.use(authenticate, requireAdmin);

router.post(
  '/',
  validate(TransactionCreationSchema),
  transactionController.createTransaction
);

router.get(
  '/client-wallet/:clientWalletId',
  validate(ClientWalletIdParamSchema),
  transactionController.getTransactionsByClientWalletId
);

router.get(
  '/admin-wallet/:adminWalletId',
  validate(AdminWalletIdParamSchema),
  transactionController.getTransactionsByAdminWalletId
);

router.get(
  '/',
  transactionController.getAllTransactions
);

router.get(
  '/:id',
  validate(TransactionIdSchema),
  transactionController.getTransactionById
);

router.delete(
  '/:id',
  validate(TransactionIdSchema),
  transactionController.deleteTransaction
);

export default router;