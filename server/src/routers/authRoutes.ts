import { Router } from "express";
import { AuthController } from "../controllers/AuthController";



const router = Router()
const authController = new AuthController()
router.post ('/signup', authController.createClient)
router.post ('/admin/register', authController.createAdmin)
router.post('/login', authController.login)
router.get('/me', authController.getMe)
router.get('/refresh-token', authController.refreshToken)
router.post('/resend-verification-code',authController.resendCode)
router.post('/forgot-password',authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)
router.post('/resend-verification-code',authController.resendCode)
router.get('/logout',authController.logout)
router.post('/verify-email', authController.verifyEmail)

export default router