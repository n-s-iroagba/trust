import { useState, useCallback } from 'react';
import { TransactionRequestService } from '../services/transactionRequestService';
import {TransactionRequestCreationDto, UpdateStatusDto } from '../types/transactionRequest';


export const useTransactionRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransactionRequest = useCallback(async (data: TransactionRequestCreationDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionRequestService.createTransactionRequest(data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionRequestById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionRequestService.getTransactionRequestById(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionRequestsByClientWalletId = useCallback(async (clientWalletId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionRequestService.getTransactionRequestsByClientWalletId(clientWalletId);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionRequestsByStatus = useCallback(async (status: 'pending' | 'successful' | 'failed') => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionRequestService.getTransactionRequestsByStatus(status);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransactionRequestStatus = useCallback(async (id: number, data: UpdateStatusDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionRequestService.updateTransactionRequestStatus(id, data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTransactionRequest,
    getTransactionRequestById,
    getTransactionRequestsByClientWalletId,
    getTransactionRequestsByStatus,
    updateTransactionRequestStatus,
  };
};