import { Router } from 'express';
import { AdminWalletController } from '../controllers/AdminWalletController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation/validationMiddleware';
import { 
  AdminWalletCreationSchema, 
  AdminWalletUpdateSchema, 
  AdminWalletIdSchema 
} from '../middlewares/validation/schemas';


const router = Router();
const adminWalletController = new AdminWalletController();

// // All routes require admin authentication
// router.use(authenticate, requireAdmin);

router.post(
  '/',
  // validate(AdminWalletCreationSchema),
  adminWalletController.createAdminWallet
);

router.put(
  '/:id',
  // validate(AdminWalletIdSchema),
  // validate(AdminWalletUpdateSchema),
  adminWalletController.updateAdminWallet
);

router.get(
  '/',
  adminWalletController.getAllAdminWallets
);

router.get(
  '/:id',
  // validate(AdminWalletIdSchema),
  adminWalletController.getAdminWalletById
);

router.delete(
  '/:id',
  // validate(AdminWalletIdSchema),
  adminWalletController.deleteAdminWallet
);

export default router;