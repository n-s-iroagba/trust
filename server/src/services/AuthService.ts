import User from "../models/User"
import UserRepository from "../repositories/UserRepository"
import { SignUpRequestDto, SignUpResponseDto, Role, LoginRequestDto, AuthServiceLoginResponse, VerifyEmailRequestDto, ResetPasswordRequestDto, AuthUser } from "../types/auth.types"
import { EmailService } from "./EmailService"
import { BadRequestError, ConflictError, NotFoundError } from "./errors/AppError"
import logger from "./logger/winstonLogger"
import { PasswordService } from "./PasswordService"
import { TokenService } from "./TokenService"
import { UserService } from "./UserService"
import { VerificationService } from "./VerificationService"


export class AuthService {
  private readonly passwordService: PasswordService
  private readonly userService: UserService
  private readonly emailService: EmailService
  private readonly tokenService: TokenService
  private readonly verificationService: VerificationService
  private readonly userRepository: UserRepository

  constructor() {
    this.passwordService = new PasswordService()
    this.verificationService = new VerificationService()
    this.tokenService = new TokenService('SDD')
    this.userService = new UserService()
    this.emailService = new EmailService('')
    this.userRepository = new UserRepository()
  }

  /**
   * Registers a new user and initiates email verification.
   */
  async signupCient(data: SignUpRequestDto): Promise<SignUpResponseDto> {
    try {
      logger.info('Sign up process started', { email: data.email })

      const hashedPassword = await this.passwordService.hashPassword(data.password)
      const existingUser = await this.userRepository.findUserByEmail(data.email)
      if(existingUser){
        throw new ConflictError('User with this email already exists .')
      }
      const user = await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
        role: Role.ADVERTISER,
      })

      const response = await this.verificationService.intiateEmailVerificationProcess(user)

      logger.info('Sign up completed successfully', { userId: user.id })
      return response
    } catch (error) {
      return this.handleAuthError('Sign up', { email: data.email }, error)
    }
  }

  /**
   * Creates a sports admin.
   */
  async signUpAdmin(data: SignUpRequestDto): Promise<User> {
    try {
      logger.info('Admin sign up started', { email: data.email })

      const hashedPassword = await this.passwordService.hashPassword(data.password)
      const user = await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
        role: Role.ADMIN,
        isEmailVerified:true
      })

      logger.info('Sign up completed successfully', { userId: user.id })
      return user
    } catch (error) {
      return this.handleAuthError('Admin sign up', { email: data.email }, error)
    }
  }

  /**
   * Logs a user in by validating credentials and returning tokens.
   */
  async login(data: LoginRequestDto): Promise<AuthServiceLoginResponse | SignUpResponseDto> {
    try {
      logger.info('Login attempt started', { email: data.email })

      const user = await this.userService.findUserByEmail(data.email, true)
      if (!user) {
        throw new NotFoundError('user not found')
      }

      await this.validatePassword(user, data.password)

      if (!user.isEmailVerified) {
        logger.warn('Login attempted by unverified user', { userId: user.id })
        return await this.verificationService.intiateEmailVerificationProcess(user)
      }

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Login successful', { userId: user.id })

      await this.userService.updateUser(user.id,{refreshToken})

      return { user, accessToken, refreshToken }
    } catch (error) {
      return this.handleAuthError('Login', { email: data.email }, error)
    }
  }

  /**
   * Issues a new access token from a refresh token.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      logger.info('Token refresh attempted')

      const { decoded } = this.tokenService.verifyToken(refreshToken, 'refresh')

      const id = decoded.id
      if (!id) {
        logger.warn('Invalid refresh token provided')
        throw new BadRequestError('Invalid refresh token')
      }

      const user = await this.userService.findUserById(id)
      const newAccessToken = this.tokenService.generateAccessToken(user)

      logger.info('Token refreshed successfully', { userId: user.id })
      return { accessToken: newAccessToken }
    } catch (error) {
      return this.handleAuthError('Token refresh', {}, error)
    }
  }

  /**
   * Verifies a user's email using a token and code.
   */
  async verifyEmail(data: VerifyEmailRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Email verification started')
 const user = await this.userRepository.findUserByVerificationToken(data.verificationCode)
      const { decoded } = this.tokenService.verifyToken(data.verificationToken, 'email_verification')
    
      if (!user) {
        logger.warn('Invalid verification token provided')
        throw new NotFoundError('User with Token not found.')
      }

      
     
      this.verificationService.validateVerificationCode(user, data.verificationCode)
      await this.userService.markUserAsVerified(user)

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Email verification successful', { userId: user.id })
      await this.userService.updateUser(user.id,{refreshToken})

 
  

      return { user, accessToken, refreshToken }
    } catch (error) {
      return this.handleAuthError('Email verification', {}, error)
    }
  }

  /**
   * Generates a new email verification code.
   */
  async generateNewCode(id: string, token: string): Promise<string> {
    try {
      logger.info('New verification code generation requested')
      return await this.verificationService.regenerateVerificationCode(id, token)
    } catch (error) {
      return this.handleAuthError('New code generation', {}, error)
    }
  }

  /**
   * Sends a password reset email to the user.
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      logger.info('Password reset requested', { email })

      const user = await this.userService.findUserByEmail(email)
      if (!user) {
        logger.error('Password reset requested for non-existent email', { email })
        throw new NotFoundError('user for forgot password not found')
      }

      const { token, hashedToken } = this.passwordService.generateResetToken()
      await this.userService.setPasswordResetDetails(user, hashedToken)
      await this.emailService.sendPasswordResetEmail(user.email, token)

      logger.info('Password reset email sent', { userId: user.id })
    } catch (error) {
      return this.handleAuthError('Password reset', { email }, error)
    }
  }

  /**
   * Resets the user's password using the reset token.
   */
  async resetPassword(data: ResetPasswordRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Password reset process started')

      const user = await this.userService.findUserByResetToken(data.resetPasswordToken)
      const hashedPassword = await this.passwordService.hashPassword(data.password)
      await this.userService.updateUserPassword(user, hashedPassword)

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Password reset successful', { userId: user.id })

      return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken)
    } catch (error) {
      return this.handleAuthError('Password reset', {}, error)
    }
  }

  /**
   * Retrieves a user by ID.
   */
  async getUserById(userId: string | number) {
    try {
      logger.info('Get user by ID requested', { userId })

      const user = await this.userService.findUserById(userId)
      logger.info('User retrieved successfully', { userId: user.id })

      return user
    } catch (error) {
      return this.handleAuthError('Get user by ID', { userId }, error)
    }
  }

  /**
   * Returns the current authenticated user's details.
   */
  async getMe(userId: number): Promise<AuthUser> {
    try {
      logger.info('Get current user requested', { userId })

      const user = await this.userService.findUserById(userId)
      logger.info('Current user retrieved successfully', { userId })

      return user as unknown as AuthUser
    } catch (error) {
      return this.handleAuthError('Get current user', { userId }, error)
    }
  }

  // ----------------- helpers -----------------

  private async validatePassword(user: any, password: string): Promise<void> {
    const isMatch = await this.passwordService.comparePasswords(password, user.password)
    if (!isMatch) {
      logger.warn('Password validation failed', { userId: user.id })
      throw new BadRequestError( 'INVALID_CREDENTIALS')
    }
    logger.info('Password validated successfully', { userId: user.id })
  }

  private generateTokenPair(user: User): { accessToken: string; refreshToken: string } {
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = this.tokenService.generateRefreshToken(user)
    return { accessToken, refreshToken }
  }

  private async saveRefreshTokenAndReturn(
    passedUser: any,
    accessToken: string,
    refreshToken: string
  ): Promise<AuthServiceLoginResponse> {
    passedUser.refreshToken = refreshToken
    await passedUser.save()
    const user = { ...passedUser.get ? passedUser.get({ plain: true }) : passedUser }
    return { accessToken, user, refreshToken }
  }

  private async handleAuthError(operation: string, context: Record<string, any>, error: any): Promise<never> {
    logger.error(`${operation} failed`, { ...context, error })
    throw error
  }
}