export class CalculationHelpers {
  static calculateNewBalance(currentBalance: number, amount: number, operation: 'credit' | 'debit'): number {
    if (!this.isValidAmount(currentBalance) || !this.isValidAmount(amount)) {
      throw new Error('Invalid amount provided for calculation');
    }

    if (operation === 'credit') {
      return Number((currentBalance + amount).toFixed(2));
    } else if (operation === 'debit') {
      if (currentBalance < amount) {
        throw new Error('Insufficient balance for debit operation');
      }
      return Number((currentBalance - amount).toFixed(2));
    }

    throw new Error('Invalid operation type');
  }

  static isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && amount >= 0 && !isNaN(amount) && isFinite(amount);
  }

  static formatCurrency(amount: number, decimals: number = 2): string {
    return amount.toFixed(decimals);
  }
}