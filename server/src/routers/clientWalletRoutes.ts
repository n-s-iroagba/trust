import { Router } from 'express';
import { ClientWalletController } from '../controllers/ClientWalletController';
import { authenticate, requireAdmin, requireClient } from '../middlewares/auth';
import { validate } from '../middlewares/validation/validationMiddleware';
import { 

  CreditDebitSchema, 
  ClientWalletIdSchema,

} from '../middlewares/validation/schemas';

const router = Router();
const clientWalletController = new ClientWalletController();

// Admin-only routes
router.post(
  '/',
  // authenticate,
  // requireAdmin,
  // validate(ClientWalletCreationSchema),
  clientWalletController.createClientWallet
);

router.get(
  '/',
  // authenticate,
  // requireAdmin,
  clientWalletController.getAllClientWallets
);

router.post(
  '/:id/credit',
  // authenticate,
  // requireAdmin,
  // validate(ClientWalletIdSchema),
  // validate(CreditDebitSchema),
  clientWalletController.creditWallet
);


// Client accessible routes
router.get(
  '/client/:clientId',
  // authenticate,
  // validate(ClientIdSchema),
  clientWalletController.getClientWalletsByClientId
);

router.get(
  '/:id',

  clientWalletController.getClientWalletById
);

export default router;