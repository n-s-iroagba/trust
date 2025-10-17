import { z } from 'zod';

export const AdminWalletCreationSchema = z.object({
  currencyAbbreviation: z.string().min(2).max(10),
  logo: z.string().url(),
  currency: z.string().min(1).max(50),
});

export const AdminWalletUpdateSchema = z.object({
  currencyAbbreviation: z.string().min(2).max(10).optional(),
  logo: z.string().url().optional(),
  currency: z.string().min(1).max(50).optional(),
});

export const AdminWalletIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const ClientWalletCreationSchema = z.object({
  adminWalletId: z.number().int().positive(),
  clientId: z.string().min(3).max(50),
});

export const CreditDebitSchema = z.object({
  amountInUSD: z.number().positive(),
  adminWalletId: z.number().int().positive(),
});

export const ClientWalletIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const TransactionCreationSchema = z.object({
  amountInUSD: z.number(),
  clientWalletId: z.number().int().positive(),
  adminWalletId: z.number().int().positive(),
});

export const TransactionIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const ClientWalletIdParamSchema = z.object({
  clientWalletId: z.string().regex(/^\d+$/, 'Client wallet ID must be a number'),
});

export const AdminWalletIdParamSchema = z.object({
  adminWalletId: z.string().regex(/^\d+$/, 'Admin wallet ID must be a number'),
});


export const TransactionRequestCreationSchema = z.object({
  clientWalletId: z.number().int().positive(),
  amountInUSD: z.number().positive(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['pending', 'successful', 'failed']),
});

export const TransactionRequestIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});


export const StatusParamSchema = z.object({
  status: z.enum(['pending', 'successful', 'failed']),
});