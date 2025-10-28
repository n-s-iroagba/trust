import { Router } from 'express';
import { clientController } from '../controllers/ClientController';

const router = Router();

// 🟢 CREATE


// 🟣 READ
router.get('/', clientController.getAllClients.bind(clientController));
router.get('/:id', clientController.getClientById.bind(clientController));
router.get('/:clientId/wallets', clientController.getClientWallets.bind(clientController));

// 🔵 AUTH
router.post('/session-token', clientController.generateSessionToken.bind(clientController));

// 🔴 DELETE
router.delete('/:id', clientController.deleteClient.bind(clientController));

// 🟡 UPDATE (Optional)
router.put('/:id', clientController.updateClient.bind(clientController));

export default router;