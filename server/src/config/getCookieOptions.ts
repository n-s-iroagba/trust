export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const options = {
    httpOnly: true,
    secure: isProduction ? true : false, // Must be false for localhost over http
    sameSite: (isProduction ? 'none' : 'none') as 'none' | 'lax' | 'strict', // Always none for cross-origin
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/', // Important to ensure it's sent on all routes
  };

  console.log('Cookie options:', {
    ...options,
    environment: process.env.NODE_ENV,
    cookieDomain: process.env.COOKIE_DOMAIN,
  });

  return options;
};
