'use client'

import { useState, useCallback } from 'react';
import { ClientService } from '../services/clientService';


export const useClients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const getAllClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.getAllClients();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.getClientById(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);



  const deleteClient = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.deleteClient(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientWallets = useCallback(async (clientId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.getClientWallets(clientId);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getAllClients,
    getClientById,

    deleteClient,
    getClientWallets,
    clearError,
  };
};