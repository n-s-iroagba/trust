import { useState, useCallback } from 'react';
import { AdminWalletService } from '../services/adminWalletService';
import { AdminWalletCreationDto, AdminWalletUpdateDto } from '../types/adminWallet';


export const useAdminWallets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdminWallet = useCallback(async (data: AdminWalletCreationDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminWalletService.createAdminWallet(data);
      return response ;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllAdminWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminWalletService.getAllAdminWallets();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdminWalletById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminWalletService.getAdminWalletById(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAdminWallet = useCallback(async (id: number, data: AdminWalletUpdateDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminWalletService.updateAdminWallet(id, data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAdminWallet = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminWalletService.deleteAdminWallet(id);
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
    createAdminWallet,
    getAllAdminWallets,
    getAdminWalletById,
    updateAdminWallet,
    deleteAdminWallet,
  };
};