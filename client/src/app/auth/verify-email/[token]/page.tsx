'use client';

import type React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { API_ROUTES } from '@/lib/api-routes';
import { ApiService } from '@/services/apiService';
import { AuthUser } from '@/types';
import { TokenService } from '@/lib/axios';
import { useAuthContext } from '@/hooks/useAuthContext';

const VerifyEmail = () => {
  const params = useParams();
  const urlToken = params.token;
  const {setUser} = useAuthContext()
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // 5-minute countdown
  const [canResend, setCanResend] = useState(false);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!urlToken) {
      setError('You are not authorized to view this page');
      setTimeout(() => router.push('/'), 300);
    } else {
      setToken(Array.isArray(urlToken) ? urlToken[0] : urlToken);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, urlToken]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5) {
      const fullCode = [...newCode].join('');
      if (fullCode.length === 6) {
        handleVerifyAuto(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').slice(0, 6);
      const updatedCode = [...code];
      newCode.forEach((digit, index) => {
        updatedCode[index] = digit;
      });
      setCode(updatedCode);

      // Focus the next empty input or submit if complete
      const emptyIndex = updatedCode.findIndex((digit) => digit === '');
      if (emptyIndex !== -1) {
        inputRefs.current[emptyIndex]?.focus();
      } else {
        handleVerifyAuto(updatedCode.join(''));
      }
    }
  };

  const handleVerifyAuto = async (verificationCode: string) => {
    await handleVerifySubmission(verificationCode);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }
    await handleVerifySubmission(verificationCode);
  };

const handleVerifySubmission = async (verificationCode: string) => {
  setLoading(true);
  setError(null);

  try {
const response = await ApiService.post<{
  user: AuthUser;
  accessToken: string;
}>(API_ROUTES.AUTH.VERIFY_EMAIL, {
  verificationCode,
  verificationToken: token,
});

    if (!response?.data) {
      throw new Error('Invalid server response: missing data');
    }
    setUser(response.data.user)
    TokenService.setAccessToken(response.data.accessToken);
    setSuccess(true);

    setTimeout(() => {
      router.push(`/${response.data?.user.role}`);
    }, 2000);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      'An error occurred during verification. Please try again.';

    setError(errorMessage);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};


  const handleResendCode = async () => {
    setResendLoading(true);
    setError(null);

    try {
      const response = await ApiService.post<{verificationToken:string}>(API_ROUTES.AUTH.RESEND_VERIFICATION_CODE, {
        verificationToken: token,
      });

      router.push(`/auth/verify-email/${response.data?.verificationToken}`)
      
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'An error occurred while resending the code. Please try again.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-sky-800 mb-4">
            Email Verified Successfully!
          </h2>
          <p className="text-sky-600 mb-6">
            Your email has been verified. Redirecting to login...
          </p>
          <div className="w-8 h-8 border-t-2 border-b-2 border-sky-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-sky-800 mb-2">
            Verify Your Email
          </h2>
          <p className="text-sky-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Success Resend Alert */}
        {!error && resendLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2v4m0 12v4m8-10h-4M6 12H2"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-blue-800 text-sm font-medium">
                  Sending new verification code...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Code Inputs */}
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 text-center text-lg font-semibold text-sky-800 border-2 border-sky-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-sky-50 shadow-sm hover:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || code.join('').length !== 6}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verify Email
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-6 pt-6 border-t border-sky-200">
          <div className="text-center">
            <p className="text-sky-700 mb-3">
              {canResend ? (
                "Didn't receive a code?"
              ) : (
                <>
                  Resend code in{' '}
                  <span className="font-semibold text-sky-800">
                    {formatTime(timeLeft)}
                  </span>
                </>
              )}
            </p>

            <button
              onClick={handleResendCode}
              disabled={!canResend || resendLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                canResend && !resendLoading
                  ? 'bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {resendLoading ? (
                <>
                  <div className="w-4 h-4 border-t-2 border-b-2 border-sky-500 rounded-full animate-spin"></div>
                  Resending...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Resend Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-sky-200">
          <div className="flex items-center justify-center gap-2 text-sm text-sky-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;