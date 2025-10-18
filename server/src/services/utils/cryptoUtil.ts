import crypto from 'crypto';

export class CryptoUtil {
  static generateRandomBytes(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static hashString(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  static generateSecureToken(): { token: string; hashedToken: string } {
    const token = this.generateRandomBytes(32);
    const hashedToken = this.hashString(token);
    return { token, hashedToken };
  }
}