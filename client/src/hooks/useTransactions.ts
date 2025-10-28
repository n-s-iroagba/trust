'use client'

import { useState, useCallback } from 'react';
import { TransactionService } from '../services/transactionService';
import {Transaction, TransactionCreationDto } from '../types/transaction';


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

  const getPendingTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.getPendingTransactions();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id: number,data:Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.updateTransaction(id,data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransactionStatus = useCallback(async (id: number,data:Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.updateTransactionStatus(id,data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionsByClientId = useCallback(async (clientWalletId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransactionService.getTransactionsByClientId(clientWalletId);
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
    getTransactionsByClientId,
    createTransaction,
    updateTransaction,
    getPendingTransactions,
    getTransactionsByClientWalletId,
    deleteTransaction,
    updateTransactionStatus
  };
};