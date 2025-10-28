// src/repositories/UserRepository.ts



import { Role } from '../types/auth.types'
import User, { UserCreationAttributes } from '../models/User'

import {BaseRepository} from './BaseRepository'

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }

  async createUser(userData: UserCreationAttributes): Promise<User> {
    return await this.create(userData)
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.findOne({where:{ email} }) as User | null
  }

  async findUserById(id: number): Promise<User | null> {
 
    return await this.findById(id) as User | null
  }

  async findUserByResetToken(hashedToken: string): Promise<User | null> {
    return await this.findOne({where:{  passwordResetToken: hashedToken} }) as User | null
  }

  async findUserByVerificationToken(token: string): Promise<User | null> {
    return await this.findOne({where:{  verificationToken: token} })
  }

  async updateUserById(id: string | number, updates: Partial<User>) {
   return await this.update(updates,{where:{id}})
   
  }

  async getAllUsers(): Promise<User[]> {
    console.log(await this.findAll())
    const result = await this.findAll()
    return result
  }
}

export default UserRepository