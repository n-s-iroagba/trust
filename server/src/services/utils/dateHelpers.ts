export class DateHelpers {
  static getCurrentDateTime(): Date {
    return new Date();
  }

  static formatDateForDB(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  static isDateValid(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static getDateRange(days: number): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start, end };
  }
}