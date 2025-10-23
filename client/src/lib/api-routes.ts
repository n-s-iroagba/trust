export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
    RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token',
  },
  ADMIN_WALLETS: {
    CREATE: '/admin-wallets',
    GET_ALL: '/admin-wallets',
    GET_BY_ID: (id: number) => `/admin-wallets/${id}`,
    UPDATE: (id: number) => `/admin-wallets/${id}`,
    DELETE: (id: number) => `/admin-wallets/${id}`,
  },

    CLIENTS: {
 
    GET_ALL: '/clients',
    GET_BY_ID: (id: number) => `/clients/${id}`,
  
    DELETE: (id: number) => `/clients/${id}`,
    GET_WALLETS: (clientId: number) => `/clients/${clientId}/wallets`,
  },
  // Client Wallet Routes
  CLIENT_WALLETS: {
    CREATE: '/client-wallets',
    GET_ALL: '/client-wallets',
    GET_BY_ID: (id: number) => `/client-wallets/${id}`,
    GET_BY_CLIENT_ID: (clientId: string) => `/client-wallets/client/${clientId}`,
    CREDIT: (id: number) => `/client-wallets/${id}/credit`,
    DEBIT: (id: number) => `/client-wallets/${id}/debit`,
  },

  // Transaction Routes
  TRANSACTIONS: {
    CREATE: '/transactions',
    GET_PENDING: '/transactions/pending',
    UPDATE: (id: number) => `/transactions/${id}`,
     GET_BY_CLIENT_ID: (clientId: number) => `/transactions/client-wallet/${clientId}`,
    GET_BY_CLIENT_WALLET_ID: (clientWalletId: number) => `/transactions/client-wallet/${clientWalletId}`,
    DELETE: (id: number) => `/transactions/${id}`,
  },



  // Health Check
  HEALTH: '/health',
} as const;

export type ApiRoutes = typeof API_ROUTES;