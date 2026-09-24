import React from 'react';
import { X, User, CloudUpload } from 'lucide-react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function AuthPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-[20px]">
      <div className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative w-full max-w-[400px] bg-[var(--surface)] rounded-[16px] border border-[var(--line)] shadow-[var(--shadow-overlay)] flex flex-col overflow-hidden z-[61] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-[24px]">
          <div className="flex justify-between items-start mb-[16px]">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--line)] flex items-center justify-center text-[var(--ink)]">
              <CloudUpload className="w-[24px] h-[24px]" strokeWidth={1.5} />
            </div>
            <button 
              onClick={onClose}
              className="p-[4px] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors rounded-[6px] outline-none focus-visible:bg-[var(--line)]"
            >
              <X className="w-[20px] h-[20px]" />
            </button>
          </div>
          
          <h2 className="font-serif text-[24px] leading-[1.2] text-[var(--ink)] mb-[8px]">
            Save your progress
          </h2>
          <p className="font-sans text-[15px] leading-[1.5] text-[var(--ink-2)] mb-[24px]">
            You're currently using EDSA Tracker anonymously. Your progress is saved locally, but will be lost if you clear your browser data. Sign in to sync across devices.
          </p>
          
          <div className="flex flex-col gap-[12px]">
            <button 
              onClick={handleSignIn}
              className="w-full h-[44px] flex items-center justify-center gap-[8px] bg-[var(--ink)] text-[var(--paper)] rounded-[10px] font-medium text-[15px] hover:opacity-90 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-[var(--paper)]"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={2} />
              Sign in with Google
            </button>
            <button 
              onClick={onClose}
              className="w-full h-[44px] flex items-center justify-center bg-transparent text-[var(--ink-2)] rounded-[10px] font-medium text-[15px] hover:bg-[var(--line)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)]"
            >
              Continue locally
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
