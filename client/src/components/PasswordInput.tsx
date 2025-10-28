"use client";

import { useState, useRef, useEffect } from "react";

export default function PasswordInput({id}:{id:number}) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(paste)) {
      const newCode = paste.split("");
      setCode(newCode);
      inputRefs.current[5]?.blur();
    }
  };

  const fullCode = code.join("");
  const handleSubmit = () => {
    alert(`Entered Code: ${fullCode}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0C0E12] text-white">
      <div className="flex flex-col items-center w-full max-w-md p-8 rounded-3xl bg-[#141821] shadow-2xl">
        <h1 className="text-2xl font-semibold mb-6">Enter Passcode</h1>

        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between w-full max-w-xs mb-8">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold bg-[#1E232E] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={fullCode.length < 6}
          className={`w-full py-3 rounded-2xl font-semibold transition-all ${
            fullCode.length === 6
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          Unlock
        </button>

        {/* Footer / Help Text */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          Use your 6-digit Trust Wallet passcode to unlock your wallet.
        </p>
      </div>
    </div>
  );
}