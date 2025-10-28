export class CalculationHelpers {
  static calculateNewBalance(currentBalance: number, amount: number, operation: 'credit' | 'debit'): number {

    if (operation === 'credit') {
      return Number((currentBalance + amount));
    } else if (operation === 'debit') {
      if (currentBalance < amount) {
        throw new Error('Insufficient balance for debit operation');
      }
      return Number((currentBalance - amount));
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