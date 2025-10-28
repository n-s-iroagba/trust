// services/verification.service.ts

import User from "../models/User";
import { AuthConfig } from "../types/auth.types";
import { EmailService } from "./EmailService";
import { BadRequestError, ForbiddenError } from "./errors/AppError";
import logger from "./logger/winstonLogger";
import { TokenService } from "./TokenService";
import { UserService } from "./UserService";
import { CodeHelper } from "./utils/CodeHelper";


export class VerificationService {
  
    private readonly tokenService: TokenService
    private readonly userService: UserService
    private readonly emailService: EmailService
    private readonly config: AuthConfig
    constructor(
      
  ) {

    this.emailService = new EmailService('');
    this.tokenService = new TokenService('aba','')
    this.userService = new UserService()
    this.config = {jwtSecret:'a',clientUrl:'',tokenExpiration:{
      verification: 0,
      login: 0,
      refresh: 0,
   
    }}
  }

  async intiateEmailVerificationProcess(
    user: User
  ): Promise<{ verificationToken: string; id: number }> {
    try {
      const verificationToken = this.tokenService.generateEmailVerificationToken(user)

      const verificationCode = process.env.NODE_ENV === 'production' ? CodeHelper.generateVerificationCode() : '123456'

       await User.update({verificationCode,verificationToken},{where:{id:user.id}})
      console.log(verificationToken)
      console.log(user)
      await this.emailService.sendVerificationEmail(user)

      logger.info('Verification details generated successfully', { userId: user.id })
      return { verificationToken, id: user.id }
    } catch (error) {
      console.error(error)
      logger.error('Error generating verification details', { userId: user.id, error })
      throw error
    }
  }

  async regenerateVerificationCode(id: string, token: string): Promise<string> {
    try {
      const u = await User.findByPk(1)
      console.log(u)
      const user = await this.userService.findUserByVerificationToken(token)
      
  
      if (user.verificationToken !== token) throw new BadRequestError('Token does not match')
      const verificationToken = this.tokenService.generateEmailVerificationToken(user)
      const verificationCode = process.env.NODE_ENV === 'production' ? CodeHelper.generateVerificationCode() : '123456'
      console.log('VVVV', verificationToken)

       await User.update({verificationCode,verificationToken},{where:{id:user.id}})
      await this.emailService.sendVerificationEmail(user)

      logger.info('Verification code regenerated', { userId: user.id })
      return verificationToken
    } catch (error) {
      logger.error('Error regenerating verification code', { error })
      throw error 
    }
  }

  validateVerificationCode(user: User, code: string): void {
    console.log(user)
    if (user.verificationCode !== code) {
      logger.warn('Invalid verification code provided', { userId: user.id })
      throw new ForbiddenError('Invalid verification code')
    }
    logger.info('Verification code validated successfully', { userId: user.id })
  }
}