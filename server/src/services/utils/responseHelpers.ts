export class ResponseHelpers {
  static success(data: any, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, errors: any[] = []) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static paginated(data: any[], total: number, page: number, limit: number) {
    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}