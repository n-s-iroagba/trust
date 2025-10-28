import { NextFunction, Request, Response } from 'express'

import {
  AuthServiceLoginResponse,
  AuthUser,
  ResendVerificationRespnseDto,
  SignUpResponseDto,
} from '../types/auth.types'

import { AuthService } from '../services/AuthService'
import { getCookieOptions } from '../config/getCookieOptions'


export class AuthController {
  private authservice: AuthService

  constructor() {
    this.authservice = new AuthService()

    // Bind methods so Express routes work correctly
    this.createClient = this.createClient.bind(this)
    this.createAdmin = this.createAdmin.bind(this)
    this.resendCode = this.resendCode.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.getMe = this.getMe.bind(this)
    this.login = this.login.bind(this)
    this.verifyEmail = this.verifyEmail.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.logout = this.logout.bind(this)
  }
 
  async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body)
      const response = await this.authservice.signUpAdmin(req.body)
      res.status(201).json({data:response})
    } catch (error) {
      next(error)
    }
  }

  async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authservice.signupCient(req.body)
      res.status(201).json({data:result})
    } catch (error) {
      next(error)
    } 
  }

  async resendCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { verificationToken, id } = req.body
      console.log(req.body)
      const newToken = await this.authservice.generateNewCode(id,verificationToken)
      res.json({data:{ verificationToken: newToken, id } as ResendVerificationRespnseDto})
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body
      if (!email) {
        res.status(400).json({ message: 'Email is required' })
        return
      }

      await this.authservice.forgotPassword(email)
      res.status(200).end()
    } catch (error) {
      next(error)
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await this.authservice.getMe(Number(userId))
      res.status(200).json(user as AuthUser)
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const result = await this.authservice.login({ email, password })

      if ('refreshToken' in result && 'accessToken' in result) {
        const verified = result as AuthServiceLoginResponse
        res.cookie('refreshToken', verified.refreshToken, getCookieOptions())
        res.status(200).json({data:{
          user: verified.user,
          accessToken: verified.accessToken,
        }})
      } else {
        res.status(200).json({data:result as SignUpResponseDto})
      }
    } catch (error) {
      next(error)
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authservice.verifyEmail(req.body)
      res.cookie('refreshToken', result.refreshToken, getCookieOptions())
      res.status(200).json({data:{
        user: result.user,
        accessToken: result.accessToken,
      }})
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authservice.resetPassword(req.body)
      res.cookie('refreshToken', result.refreshToken, getCookieOptions())

      res.status(200).json({
        user:result.user,
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log('🧩 req.cookies:', req.cookies);
    console.log('🧩 req.headers.cookie:', req.headers.cookies);
    console.log('🧩 Origin:', req.headers.origin);
    console.log('🧩 Referer:', req.headers.referer);

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      console.warn('⚠️ No refresh token found in cookies');
      res.status(401).json({ message: 'No refresh token found in cookies' });
      return;
    }

    const accessToken = await this.authservice.refreshToken(refreshToken);
    res.status(200).json(accessToken);
  } catch (error) {
    next(error);
  }
}



  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: '/',
      })
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}