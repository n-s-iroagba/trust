export class AddressGenerator {
  private static readonly ADDRESS_LENGTH = 42; // Standard Ethereum-like address length
  private static readonly CHARACTERS = '0123456789ABCDEF';

  static generateAdminWalletAddress(): string {
    return 'ADM_' + this.generateRandomHexString(this.ADDRESS_LENGTH - 4);
  }

  static generateClientWalletAddress(): string {
    return 'CLI_' + this.generateRandomHexString(this.ADDRESS_LENGTH - 4);
  }

  private static generateRandomHexString(length: number): string {
    let result = '0x';
    for (let i = 0; i < length; i++) {
      result += this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length));
    }
    return result;
  }

  static validateAddress(address: string): boolean {
    const adminPattern = /^ADM_0x[0-9A-F]{38}$/;
    const clientPattern = /^CLI_0x[0-9A-F]{38}$/;
    return adminPattern.test(address) || clientPattern.test(address);
  }
}