import { AddressGenerator } from './addressGenerator';

export class ValidationHelpers {
  static isValidCurrencyAbbreviation(abbreviation: string): boolean {
    const validAbbreviations = ['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'USDT', 'USDC'];
    return validAbbreviations.includes(abbreviation.toUpperCase());
  }

  static isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && amount >= 0 && !isNaN(amount);
  }

  static isValidClientId(clientId: string): boolean {
    return typeof clientId === 'string' && clientId.length >= 3 && clientId.length <= 50;
  }

  static isValidWalletAddress(address: string): boolean {
    return AddressGenerator.validateAddress(address);
  }

  static isValidStatus(status: string): boolean {
    const validStatuses = ['pending', 'successful', 'failed'];
    return validStatuses.includes(status);
  }
}