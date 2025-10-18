'use client'

import { useState, useCallback } from 'react';
import { TransactionService } from '../services/transactionService';
import {TransactionCreationDto } from '../types/transaction';


export const useTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(async (data: TransactionCreationDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.createTransaction(data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.getAllTransactions();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.getTransactionById(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionsByClientWalletId = useCallback(async (clientWalletId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.getTransactionsByClientWalletId(clientWalletId);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionsByAdminWalletId = useCallback(async (adminWalletId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.getTransactionsByAdminWalletId(adminWalletId);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.deleteTransaction(id);
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
    createTransaction,
    getAllTransactions,
    getTransactionById,
    getTransactionsByClientWalletId,
    getTransactionsByAdminWalletId,
    deleteTransaction,
  };
};