import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middlewares/auth";



const router = Router()
const authController = new AuthController()
router.post ('/signup', authController.createClient)
router.post ('/admin/signup', authController.createAdmin)
router.post('/login', authController.login)
router.get('/me', authenticate, authController.getMe)
router.get('/refresh', authController.refreshToken)
router.post('/resend-verification-code',authController.resendCode)
router.post('/forgot-password',authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)
router.post('/resend-verification-code',authController.resendCode)
router.get('/logout',authController.logout)
router.post('/verify-email', authController.verifyEmail)

export default router