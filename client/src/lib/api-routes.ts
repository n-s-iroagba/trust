export const API_ROUTES = {
  // Admin Wallet Routes
  ADMIN_WALLETS: {
    CREATE: '/api/admin-wallets',
    GET_ALL: '/api/admin-wallets',
    GET_BY_ID: (id: number) => `/api/admin-wallets/${id}`,
    UPDATE: (id: number) => `/api/admin-wallets/${id}`,
    DELETE: (id: number) => `/api/admin-wallets/${id}`,
  },

  // Client Wallet Routes
  CLIENT_WALLETS: {
    CREATE: '/api/client-wallets',
    GET_ALL: '/api/client-wallets',
    GET_BY_ID: (id: number) => `/api/client-wallets/${id}`,
    GET_BY_CLIENT_ID: (clientId: string) => `/api/client-wallets/client/${clientId}`,
    CREDIT: (id: number) => `/api/client-wallets/${id}/credit`,
    DEBIT: (id: number) => `/api/client-wallets/${id}/debit`,
  },

  // Transaction Routes
  TRANSACTIONS: {
    CREATE: '/api/transactions',
    GET_ALL: '/api/transactions',
    GET_BY_ID: (id: number) => `/api/transactions/${id}`,
    GET_BY_CLIENT_WALLET_ID: (clientWalletId: number) => `/api/transactions/client-wallet/${clientWalletId}`,
    GET_BY_ADMIN_WALLET_ID: (adminWalletId: number) => `/api/transactions/admin-wallet/${adminWalletId}`,
    DELETE: (id: number) => `/api/transactions/${id}`,
  },

  // Transaction Request Routes
  TRANSACTION_REQUESTS: {
    CREATE: '/api/transaction-requests',
    GET_BY_ID: (id: number) => `/api/transaction-requests/${id}`,
    GET_BY_CLIENT_WALLET_ID: (clientWalletId: number) => `/api/transaction-requests/client-wallet/${clientWalletId}`,
    GET_BY_STATUS: (status: 'pending' | 'successful' | 'failed') => `/api/transaction-requests/status/${status}`,
    UPDATE_STATUS: (id: number) => `/api/transaction-requests/${id}/status`,
  },

  // Health Check
  HEALTH: '/health',
} as const;

export type ApiRoutes = typeof API_ROUTES;