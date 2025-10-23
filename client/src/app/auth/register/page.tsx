'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, Copy, Download, Eye, EyeOff, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/services/apiService';
import { API_ROUTES } from '@/lib/api-routes';

export default function WalletRegistration() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCopiedOrDownloaded, setHasCopiedOrDownloaded] = useState(false);
  const router = useRouter()

  // Generate 12-word recovery phrase using one word for each letter A-Z
  const generateRecoveryPhrase = (): string[] => {
    const wordList = [
      'apple', 'banana', 'cherry', 'dolphin', 'elephant', 'flamingo', 
      'giraffe', 'honey', 'igloo', 'jaguar', 'koala', 'lemon', 
      'mango', 'night', 'orange', 'penguin', 'queen', 'rabbit', 
      'sunset', 'tiger', 'umbrella', 'violin', 'whale', 'xray', 
      'yacht', 'zebra'
    ];
    
    // Shuffle and take first 12 words
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  };

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Submit registration data to server
  const submitRegistration = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        password,
        pin,
        recoveryPhrase: recoveryPhrase.join(' '), // Convert array to space-separated string
        createdAt: new Date().toISOString()
      };

      console.log('Submitting registration payload:', payload);

      ApiService.post(API_ROUTES.AUTH.SIGNUP,payload)

    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-progress when email and password are valid
  useEffect(() => {
    if (step === 1 && firstName && lastName && isValidEmail(email) && isValidPassword(password) && password === confirmPassword) {
      const timer = setTimeout(() => {
        setStep(2);
        setError('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [firstName, lastName, email, password, confirmPassword, step]);

  // Auto-progress when PIN is complete
  useEffect(() => {
    if (step === 2 && pin.length === 6 && /^\d+$/.test(pin)) {
      const timer = setTimeout(() => {
        setStep(3);
        setError('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pin, step]);

  // Auto-progress when PIN confirmation is complete
  useEffect(() => {
    if (step === 3 && pinConfirm.length === 6 && pin === pinConfirm) {
      const timer = setTimeout(() => {
        const phrase = generateRecoveryPhrase();
        setRecoveryPhrase(phrase);
        setStep(4);
        setError('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pinConfirm, pin, step]);

  // Auto-progress after user has copied or downloaded recovery phrase
  useEffect(() => {
    if (step === 4 && hasCopiedOrDownloaded) {
      const timer = setTimeout(() => {
        setStep(5);
        // Submit registration data to server
        submitRegistration();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCopiedOrDownloaded, step]);

  const handleDownloadPhrase = () => {
    const text = `TrustX Wallet Recovery Phrase\n\nIMPORTANT: Keep this phrase safe and secure!\n\nRecovery Phrase: ${recoveryPhrase.join(' ')}\n\nDate Created: ${new Date().toLocaleDateString()}\nEmail: ${email}\n\nInstructions:\n- Never share this phrase with anyone\n- Store it in a secure location\n- This phrase can restore your wallet if you lose access`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'trustx_wallet_recovery_phrase.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Mark as downloaded
    setHasCopiedOrDownloaded(true);
  };

  const copyToClipboard = (word: string, index: number) => {
    navigator.clipboard.writeText(word);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    
    // Mark as copied (even partial copy counts)
    setHasCopiedOrDownloaded(true);
  };

  const copyFullPhrase = () => {
    navigator.clipboard.writeText(recoveryPhrase.join(' '));
    setCopiedIndex(-1); // Use -1 to indicate full phrase copied
    setTimeout(() => setCopiedIndex(null), 2000);
    
    // Mark as copied
    setHasCopiedOrDownloaded(true);
  };

  // Step indicators
  const steps = [
    { number: 1, title: 'Account' },
    { number: 2, title: 'Create PIN' },
    { number: 3, title: 'Confirm PIN' },
    { number: 4, title: 'Recovery Phrase' },
    { number: 5, title: 'Complete' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Wallet Setup</h1>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step > stepItem.number 
                  ? 'bg-green-500 text-white' 
                  : step === stepItem.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepItem.number ? <Check size={16} /> : stepItem.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  step > stepItem.number ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        
        {/* Step 1: Account Information */}
        {step === 1 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Set up your wallet account</p>
            </div>

            <div className="space-y-4">
              {/* First Name Input */}
              <div className="text-left">
                <label className="text-gray-700 text-sm font-semibold block mb-2">First Name</label>
                <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Last Name Input */}
              <div className="text-left">
                <label className="text-gray-700 text-sm font-semibold block mb-2">Last Name</label>
                <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="text-left">
                <label className="text-gray-700 text-sm font-semibold block mb-2">Email Address</label>
                <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                  />
                </div>
                {email && !isValidEmail(email) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                )}
              </div>

              {/* Password Input */}
              <div className="text-left">
                <label className="text-gray-700 text-sm font-semibold block mb-2">Password</label>
                <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                  <div className="flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {password && !isValidPassword(password) && (
                  <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="text-left">
                <label className="text-gray-700 text-sm font-semibold block mb-2">Confirm Password</label>
                <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                  <div className="flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                    />
                    <button 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              {isValidEmail(email) && isValidPassword(password) && password === confirmPassword && (
                <p className="text-green-600 text-sm">✓ Account details accepted, proceeding to PIN setup...</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Create PIN */}
        {step === 2 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create PIN</h2>
              <p className="text-gray-600">Enter a 6-digit PIN for your wallet</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="••••••"
                  className="w-full bg-transparent text-gray-900 text-4xl font-bold placeholder-gray-400 outline-none text-center tracking-widest"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => setShowPin(!showPin)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <span className="text-sm text-gray-500">Show PIN</span>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {pin.length === 6 && (
                <p className="text-green-600 text-sm">✓ PIN accepted, proceeding...</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirm PIN */}
        {step === 3 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm PIN</h2>
              <p className="text-gray-600">Re-enter your 6-digit PIN</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                <input
                  type={showPinConfirm ? 'text' : 'password'}
                  value={pinConfirm}
                  onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="••••••"
                  className="w-full bg-transparent text-gray-900 text-4xl font-bold placeholder-gray-400 outline-none text-center tracking-widest"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => setShowPinConfirm(!showPinConfirm)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPinConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <span className="text-sm text-gray-500">Show PIN</span>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {pinConfirm.length === 6 && pin === pinConfirm && (
                <p className="text-green-600 text-sm">✓ PIN confirmed, creating wallet...</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Recovery Phrase */}
        {step === 4 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recovery Phrase</h2>
              <p className="text-gray-600">Save this phrase securely. Never share it.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {recoveryPhrase.map((word, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => copyToClipboard(word, index)}
                  >
                    <div>
                      <span className="text-gray-500 text-xs">{index + 1}.</span>
                      <span className="text-gray-900 font-semibold ml-2">{word}</span>
                    </div>
                    {copiedIndex === index ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs">(Click words to copy)</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadPhrase}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={copyFullPhrase}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Copy size={16} />
                Copy All
              </button>
            </div>

            {hasCopiedOrDownloaded ? (
              <p className="text-green-600 text-sm">✓ Recovery phrase saved, completing setup...</p>
            ) : (
              <p className="text-yellow-600 text-sm">Please download or copy your recovery phrase to continue</p>
            )}
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Created!</h2>
              <p className="text-gray-600">Your wallet is secure and ready to use</p>
            </div>
            
            <div className="border-2 border-gray-300 rounded-xl p-4 text-left">
              <p className="text-gray-700 text-sm">Name: {firstName} {lastName}</p>
              <p className="text-gray-700 text-sm mt-2">Email: {email}</p>
              <p className="text-gray-700 text-sm mt-2">PIN: ••••••</p>
              <p className="text-gray-900 text-sm font-mono mt-2 opacity-50">
                {recoveryPhrase.map((word, i) => (
                  <span key={i} className="mr-2">••••</span>
                ))}
              </p>
              <button onClick={()=>router.push('/client')}>Dashboard</button>
            </div>

            {isSubmitting ? (
              <p className="text-blue-600 text-sm">Finalizing your wallet setup...</p>
            ) : (
              <p className="text-green-600 text-sm">✓ Setup complete. Redirecting to dashboard...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}