import User from '../models/User'
import UserRepository from '../repositories/UserRepository'
import { SignUpRequestDto } from '../types/auth.types'
import { UnauthorizedError, NotFoundError, BadRequestError } from './errors/AppError'
import logger from './logger/winstonLogger'
import { CryptoUtil } from './utils/cryptoUtil'


export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  // -------------------------------
  // 🟢 CREATE
  // -------------------------------
  async createUser(userData: SignUpRequestDto): Promise<User> {
    try {
      const existingUser = await this.findUserByEmail(userData.email)

      if (existingUser) {
        logger.warn('Attempt to create user with existing email', { email: userData.email })
        throw new UnauthorizedError('User already exists')
      }

      const user = await this.userRepository.createUser(userData)
      logger.info('User created successfully', { userId: user.id, email: userData.email })

      return user
    } catch (error) {
      logger.error('Error creating user', { email: userData.email, error })
      throw error
    }
  }

  // -------------------------------
  // 🟣 READ
  // -------------------------------
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.getAllUsers()
      logger.info('Fetched all users', { count: users.length })
      return users
    } catch (error) {
      logger.error('Error fetching users', { error })
      throw error
    }
  }

  async findUserById(id: string | number): Promise<User> {
    try {
      const user = await this.userRepository.findUserById(id as number)
      if (!user) {
        logger.warn('User not found by ID', { userId: id })
        throw new NotFoundError('USER_NOT_FOUND')
      }
      logger.info('User found by ID', { userId: id })
      return user
    } catch (error) {
      logger.error('Error finding user by ID', { userId: id, error })
      throw error
    }
  }

  async findUserByEmail(email: string, shouldThrowError = false): Promise<User | null> {
    try {
      const user = await this.userRepository.findUserByEmail(email)
      if (!user && shouldThrowError) {
        logger.warn('User not found by email', { email })
        throw new BadRequestError('INVALID_CREDENTIALS')
      }
      if (user) {
        logger.info('User found by email', { userId: user.id, email })
      }
      return user
    } catch (error) {
      logger.error('Error finding user by email', { email, error })
      throw error
    }
  }

  // -------------------------------
  // 🟠 UPDATE
  // -------------------------------
  async updateUser(id: string | number, updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUserById(id, updates)
      if (!updatedUser) {
        throw new NotFoundError('USER_NOT_FOUND')
      }
      logger.info('User updated successfully', { userId: id })
      return updatedUser
    } catch (error) {
      logger.error('Error updating user', { userId: id, error })
      throw error
    }
  }

  // -------------------------------
  // 🔴 DELETE
  // -------------------------------
  async deleteUser(id: string | number): Promise<boolean> {
    try {
      const deleted = await this.userRepository.delete(id)
      if (!deleted) {
        throw new NotFoundError('USER_NOT_FOUND')
      }
      logger.info('User deleted successfully', { userId: id })
      return true
    } catch (error) {
      logger.error('Error deleting user', { userId: id, error })
      throw error
    }
  }

  // -------------------------------
  // ⚙️ Additional Auth Utilities
  // -------------------------------
  async findUserByResetToken(token: string): Promise<User> {
    try {
      const hashedToken = CryptoUtil.hashString(token)
      const user = await this.userRepository.findUserByResetToken(hashedToken)
      if (!user) {
        throw new UnauthorizedError('Invalid or expired reset token')
      }
      return user
    } catch (error) {
      logger.error('Error finding user by reset token', { error })
      throw error
    }
  }

  async findUserByVerificationToken(token: string): Promise<User> {
    try {
      const user = await this.userRepository.findUserByVerificationToken(token)
      if (!user) {
        throw new NotFoundError('User not found by verification token')
      }
      return user
    } catch (error) {
      logger.error('Error finding user by verification token', { error })
      throw error
    }
  }

  async updateUserVerification(user: User, verificationCode: string, verificationToken: string): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUserById(user.id, { verificationCode, verificationToken })
      if (!updatedUser) throw new NotFoundError('USER_NOT_FOUND')
      return updatedUser
    } catch (error) {
      logger.error('Error updating user verification', { userId: user.id, error })
      throw error
    }
  }

  async markUserAsVerified(user: User): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUserById(user.id, {
        isEmailVerified: true,
        verificationCode: null,
        verificationToken: null,
      })
      if (!updatedUser) throw new NotFoundError('USER_NOT_FOUND')
      return updatedUser
    } catch (error) {
      logger.error('Error marking user as verified', { userId: user.id, error })
      throw error
    }
  }

  async setPasswordResetDetails(user: User, hashedToken: string): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUserById(user.id, { passwordResetToken: hashedToken })
      if (!updatedUser) throw new NotFoundError('USER_NOT_FOUND')
      return updatedUser
    } catch (error) {
      logger.error('Error setting password reset details', { userId: user.id, error })
      throw error
    }
  }

  async updateUserPassword(user: User, hashedPassword: string): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUserById(user.id, {
        password: hashedPassword,
        passwordResetToken: null,
      })
      if (!updatedUser) throw new NotFoundError('USER_NOT_FOUND')
      return updatedUser
    } catch (error) {
      logger.error('Error updating user password', { userId: user.id, error })
      throw error
    }
  }
}