'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Phone,
} from 'lucide-react';
import { ApiService } from '@/services/apiService';
import { API_ROUTES } from '@/lib/api-routes';
import { useRouter } from 'next/navigation';

// ----------------------
// Types
// ----------------------
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AdvertiserFormData {
  companyName: string;
  contactName: string;
  contact_email: string;
  contact_phone: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

type ValidationErrors = Partial<Record<string, string>>;

// ----------------------
// Constants
// ----------------------
const SIGNUP_FORM_DEFAULT_DATA: SignupFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const ADVERTISER_DEFAULT_DATA: AdvertiserFormData = {
  companyName: '',
  contactName: '',
  contact_email: '',
  contact_phone: '',
};

// ----------------------
// Component
// ----------------------
export default function SignupForm() {
  const [userData, setUserData] = useState(SIGNUP_FORM_DEFAULT_DATA);
  const [advertiserData, setAdvertiserData] = useState(ADVERTISER_DEFAULT_DATA);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [focusedField, setFocusedField] = useState('');
  const router = useRouter();

  // ----------------------
  // Password validation
  // ----------------------
  const validatePassword = (password: string): PasswordValidation => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(userData.password);

  // ----------------------
  // Handlers
  // ----------------------
  const handleUserChange =
    (field: keyof SignupFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUserData((prev) => ({ ...prev, [field]: value }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (error) setError('');
    };

  const handleAdvertiserChange =
    (field: keyof AdvertiserFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAdvertiserData((prev) => ({ ...prev, [field]: value }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (error) setError('');
    };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // --- User ---
    if (!userData.username.trim()) errors.username = 'Username is required';
    if (!userData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      errors.email = 'Enter a valid email';

    if (!userData.password) errors.password = 'Password is required';
    else if (!passwordValidation.isValid)
      errors.password = 'Password does not meet requirements';

    if (!userData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password';
    else if (userData.password !== userData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    // --- Advertiser ---
    if (!advertiserData.companyName.trim())
      errors.companyName = 'Company name is required';
    if (!advertiserData.contactName.trim())
      errors.contactName = 'Contact name is required';
    if (!advertiserData.contact_email.trim())
      errors.contact_email = 'Contact email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(advertiserData.contact_email))
      errors.contact_email = 'Enter a valid contact email';
    if (!advertiserData.contact_phone.trim())
      errors.contact_phone = 'Contact phone is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Send both user and advertiser data together
      const payload = {
        user: userData,
        advertiser: advertiserData,
      };

      const response = await ApiService.post<{verificationToken:string}>(API_ROUTES.AUTH.ADMIN_SIGNUP, payload);

      router.push(`/auth/verify-email/${response.data?.verificationToken}`);
    } catch (err) {
      console.error('Sign up error',err)
       setError('Registeration error occured')
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError?: string): string =>
    `
    w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 
    bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
    ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/50'
        : 'border-sky-200 hover:border-sky-300'
    }
  `;

  // ----------------------
  // JSX
  // ----------------------
  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-white/80 to-sky-50/80 rounded-2xl shadow-xl backdrop-blur-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-center text-sky-600">
          Create User & Advertiser Account
        </h2>

        {/* Username */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={handleUserChange('username')}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField('')}
            className={inputClasses(validationErrors.username)}
          />
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {validationErrors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleUserChange('email')}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            className={inputClasses(validationErrors.email)}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={userData.password}
            onChange={handleUserChange('password')}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            className={inputClasses(validationErrors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {validationErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={userData.confirmPassword}
            onChange={handleUserChange('confirmPassword')}
            className={inputClasses(validationErrors.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />{' '}
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* --- Advertiser Info --- */}
        <h3 className="text-lg font-medium text-sky-700 mt-8">
          Advertiser Details
        </h3>

        {/* Company Name */}
        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Company Name"
            value={advertiserData.companyName}
            onChange={handleAdvertiserChange('companyName')}
            className={inputClasses(validationErrors.companyName)}
          />
          {validationErrors.companyName && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {validationErrors.companyName}
            </p>
          )}
        </div>

        {/* Contact Name */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Contact Name"
            value={advertiserData.contactName}
            onChange={handleAdvertiserChange('contactName')}
            className={inputClasses(validationErrors.contactName)}
          />
          {validationErrors.contactName && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {validationErrors.contactName}
            </p>
          )}
        </div>

        {/* Contact Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Contact Email"
            value={advertiserData.contact_email}
            onChange={handleAdvertiserChange('contact_email')}
            className={inputClasses(validationErrors.contact_email)}
          />
          {validationErrors.contact_email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />{' '}
              {validationErrors.contact_email}
            </p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            placeholder="Contact Phone"
            value={advertiserData.contact_phone}
            onChange={handleAdvertiserChange('contact_phone')}
            className={inputClasses(validationErrors.contact_phone)}
          />
          {validationErrors.contact_phone && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />{' '}
              {validationErrors.contact_phone}
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 text-white font-medium flex items-center justify-center gap-2 hover:from-sky-500 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}
