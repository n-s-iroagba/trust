import { api } from '../lib/axios';
import { ApiResponse, ErrorResponse } from '../types/api';

export class ApiService {
  private static handleError(error: any): ErrorResponse {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }

  static async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}