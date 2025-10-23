import { Router } from "express";
import adminWalletRoutes from "./adminWalletRoutes";

const router = Router()


router.use('/admin-wallet',adminWalletRoutes)