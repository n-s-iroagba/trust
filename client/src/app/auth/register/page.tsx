import { useState, useEffect } from 'react';
import { ChevronLeft, Copy, Download, Eye, EyeOff, Check } from 'lucide-react';

export default function WalletRegistration() {
  const [step, setStep] = useState(1);
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
  const [savedToGoogle, setSavedToGoogle] = useState(false);
  const [verifyPhrase, setVerifyPhrase] = useState<Record<number, string>>({});
  const [verifyOrder, setVerifyOrder] = useState<number[]>([]);
  const [error, setError] = useState('');

  // Generate 12-word recovery phrase
  const generateRecoveryPhrase = (): string[] => {
    const wordList = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'academy', 'accept', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acknowledge', 'acquire', 'across', 'act', 'action', 'activate', 'active', 'actor',
      'actual', 'acute', 'add', 'address', 'adjust', 'admin', 'admire', 'admit',
      'adopt', 'adore', 'adorn', 'adult', 'advance', 'advise', 'advocate', 'affair',
      'afford', 'afraid', 'after', 'again', 'against', 'age', 'agent', 'agree',
      'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alert'
    ];

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

  // Auto-progress when email and password are valid
  useEffect(() => {
    if (step === 1 && isValidEmail(email) && isValidPassword(password) && password === confirmPassword) {
      const timer = setTimeout(() => {
        setStep(2);
        setError('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [email, password, confirmPassword, step]);

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

  // Auto-progress after showing recovery phrase
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        // Select 3 random words to verify
        const randomIndices: number[] = [];
        while (randomIndices.length < 3) {
          const idx = Math.floor(Math.random() * 12);
          if (!randomIndices.includes(idx)) randomIndices.push(idx);
        }
        setVerifyOrder(randomIndices);
        setVerifyPhrase({});
        setStep(5);
      }, 5000); // Show phrase for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Auto-progress when verification is complete
  useEffect(() => {
    if (step === 5 && Object.keys(verifyPhrase).length === 3) {
      let allCorrect = true;
      for (let i = 0; i < verifyOrder.length; i++) {
        const correctWord = recoveryPhrase[verifyOrder[i]];
        const userWord = verifyPhrase[i];
        if (userWord !== correctWord) {
          allCorrect = false;
          setError(`Word ${i + 1} is incorrect. Expected "${correctWord}"`);
          break;
        }
      }
      
      if (allCorrect) {
        const timer = setTimeout(() => {
          setStep(6);
          setError('');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [verifyPhrase, step, recoveryPhrase, verifyOrder]);

  const handleDownloadPhrase = () => {
    const text = `Recovery Phrase\n\n${recoveryPhrase.join(' ')}\n\nKeep this phrase safe!`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'recovery_phrase.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToGoogle = async () => {
    setSavedToGoogle(true);
  };

  const copyToClipboard = (word: string, index: number) => {
    navigator.clipboard.writeText(word);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleVerifyInput = (position: number, value: string) => {
    setVerifyPhrase({ ...verifyPhrase, [position]: value });
  };

  // Step indicators
  const steps = [
    { number: 1, title: 'Account' },
    { number: 2, title: 'Create PIN' },
    { number: 3, title: 'Confirm PIN' },
    { number: 4, title: 'Recovery Phrase' },
    { number: 5, title: 'Verify Phrase' },
    { number: 6, title: 'Complete' }
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
        
        {/* Step 1: Email and Password */}
        {step === 1 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Set up your wallet account</p>
            </div>

            <div className="space-y-4">
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
                    autoFocus
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
                onClick={handleSaveToGoogle}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                  savedToGoogle
                    ? 'bg-green-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {savedToGoogle ? <Check size={16} /> : null}
                {savedToGoogle ? 'Saved' : 'Save to Drive'}
              </button>
            </div>
            
            <p className="text-blue-600 text-sm">✓ Showing recovery phrase, proceeding to verification...</p>
          </div>
        )}

        {/* Step 5: Verify Recovery Phrase */}
        {step === 5 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Recovery Phrase</h2>
              <p className="text-gray-600">Enter the words in the correct order</p>
            </div>

            <div className="space-y-4">
              {verifyOrder.map((wordIndex, position) => (
                <div key={position} className="text-left">
                  <label className="text-gray-700 text-sm font-semibold block mb-2">
                    Word #{wordIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={verifyPhrase[position] || ''}
                    onChange={(e) => handleVerifyInput(position, e.target.value.toLowerCase())}
                    placeholder="Enter word"
                    className="w-full border-2 border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
                    autoFocus={position === 0}
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {Object.keys(verifyPhrase).length === 3 && !error && (
              <p className="text-green-600 text-sm">✓ Verification complete, finalizing setup...</p>
            )}
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <div className="text-center space-y-6 max-w-md mx-auto w-full">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Created!</h2>
              <p className="text-gray-600">Your wallet is secure and ready to use</p>
            </div>
            
            <div className="border-2 border-gray-300 rounded-xl p-4 text-left">
              <p className="text-gray-700 text-sm">Email: {email}</p>
              <p className="text-gray-700 text-sm mt-2">PIN: ••••••</p>
              <p className="text-gray-900 text-sm font-mono mt-2 opacity-50">
                {recoveryPhrase.map((word, i) => (
                  <span key={i} className="mr-2">••••</span>
                ))}
              </p>
            </div>

            <p className="text-green-600 text-sm">✓ Setup complete. Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}