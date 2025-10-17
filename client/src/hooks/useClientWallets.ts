import { useState, useCallback } from 'react';
import { ClientWalletService } from '../services/clientWalletService';
import { ClientWalletCreationDto, CreditDebitDto } from '../types/clientWallet';
import { ApiResponse } from '../types/api';

export const useClientWallets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClientWallet = useCallback(async (data: ClientWalletCreationDto)=> {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientWalletService.createClientWallet(data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllClientWallets = useCallback(async ()=> {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientWalletService.getAllClientWallets();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientWalletById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientWalletService.getClientWalletById(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientWalletsByClientId = useCallback(async (clientId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientWalletService.getClientWalletsByClientId(clientId);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const creditWallet = useCallback(async (id: number, data: CreditDebitDto): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientWalletService.creditWallet(id, data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const debitWallet = useCallback(async (id: number, data: CreditDebitDto): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientWalletService.debitWallet(id, data);
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
    createClientWallet,
    getAllClientWallets,
    getClientWalletById,
    getClientWalletsByClientId,
    creditWallet,
    debitWallet,
  };
};