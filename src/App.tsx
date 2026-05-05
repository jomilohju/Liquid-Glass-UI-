/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

const ThemeContext = createContext<{theme: 'dark' | 'light', toggleTheme: () => void}>({theme: 'dark', toggleTheme: () => {}});

function GlassModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as unknown as HTMLElement[];
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as unknown as HTMLElement[];
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 10);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--modal-overlay)] backdrop-blur-xl transition-opacity" onClick={onClose} aria-hidden="true" />
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-[400px] bg-[var(--glass-bg)] backdrop-blur-[40px] border border-[var(--glass-border-hover)] rounded-[24px] p-8 shadow-[var(--glass-shadow-hover)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 id="modal-title" className="text-[18px] font-semibold text-[var(--text-main)]">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--secondary-btn-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--secondary-btn-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
            aria-label="Close modal"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

function GlassCard({ title, description, children, className = '' }: { title?: string; description?: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-8 shadow-[var(--glass-shadow)] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--glass-shadow-hover)] hover:border-[var(--glass-border-hover)] ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-[20px] font-semibold text-[var(--text-main)] mb-1">{title}</h3>}
          {description && <p className="text-[var(--text-muted)] text-[14px] leading-relaxed">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function GlassInput({ label, placeholder, defaultValue, type = "text", className = '', ...props }: any) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[12px] font-medium text-[var(--text-muted)]">{label}</label>}
      <input 
        type={type}
        className="bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] text-[14px] outline-none w-full focus:border-[#6366f1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] hover:border-[#6366f1]/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] focus:hover:border-[#6366f1] transition-all placeholder:text-[var(--text-muted)]" 
        placeholder={placeholder} 
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  );
}

function GlassButton({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  LeftIcon, 
  RightIcon, 
  className = '', 
  children, 
  ...props 
}: any) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "border border-white/20 bg-[#6366f1] text-[var(--primary-btn-text)] shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:bg-indigo-400 focus:ring-indigo-400",
    secondary: "border border-[var(--glass-border)] bg-[var(--secondary-btn-bg)] text-[var(--text-main)] hover:bg-[var(--secondary-btn-hover)] focus:ring-[var(--glass-border-hover)]",
    ghost: "border border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--ghost-btn-hover)] hover:text-[var(--text-main)] focus:ring-[var(--glass-border-hover)]",
    destructive: "border border-rose-500/30 bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 focus:ring-rose-500",
    link: "border-transparent bg-transparent text-[#6366f1] hover:underline underline-offset-4 focus:ring-[#6366f1]"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-13 px-8 text-base",
    icon: "h-11 w-11 p-0"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && LeftIcon && <span className="mr-2 flex-shrink-0">{LeftIcon}</span>}
      <span className="truncate">{children}</span>
      {!loading && RightIcon && <span className="ml-2 flex-shrink-0">{RightIcon}</span>}
    </button>
  );
}

function GlassBadge({ children, variant = 'default', className = '' }: any) {
  const variants = {
    default: "bg-[var(--glass-border)] text-[var(--text-main)] border-[var(--glass-border-hover)]",
    primary: "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/30",
    success: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    destructive: "bg-rose-500/20 text-rose-500 border-rose-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
}

function GlassAvatar({ src, alt, fallback, size = 'md', className = '' }: any) {
  const sizes = {
    sm: "w-8 h-8 text-[12px]",
    md: "w-10 h-10 text-[14px]",
    lg: "w-12 h-12 text-[16px]",
  };
  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--glass-border)] bg-[var(--secondary-btn-bg)] shrink-0 ${sizes[size as keyof typeof sizes]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-[var(--text-main)]">{fallback}</span>
      )}
    </div>
  );
}

function GlassAlert({ title, children, type = 'info', className = '' }: any) {
  const types = {
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    destructive: "bg-rose-500/10 border-rose-500/20 text-rose-500",
  };
  
  const icons = {
    info: <circle cx="12" cy="12" r="10" />,
    success: <polyline points="20 6 9 17 4 12" />,
    warning: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" />,
    destructive: <path d="M18 6L6 18M6 6l12 12" />
  };

  return (
    <div className={`flex gap-3 p-4 rounded-2xl border backdrop-blur-[12px] ${types[type as keyof typeof types]} ${className}`}>
      <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[type as keyof typeof icons]}
      </svg>
      <div className="flex flex-col gap-1">
        {title && <h5 className="font-semibold text-[14px] leading-tight">{title}</h5>}
        {children && <div className="text-[13px] opacity-90 leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}

function GlassSpinner({ size = 'md', className = '' }: any) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };
  return (
    <div className={`animate-spin rounded-full border-t-[#6366f1] border-r-transparent border-b-[#6366f1]/30 border-l-[#6366f1]/30 ${sizes[size as keyof typeof sizes]} ${className}`} />
  );
}

function GlassIconButton({ className = '', variant = 'secondary', onClick, children, ...props }: any) {
  const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0";
  const variants = {
    primary: "bg-[#6366f1] border border-white/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:bg-indigo-400 focus:ring-indigo-400 focus:ring-offset-[var(--bg-color)]",
    secondary: "bg-[var(--secondary-btn-bg)] border border-[var(--glass-border)] text-[var(--text-main)] hover:bg-[var(--secondary-btn-hover)] focus:ring-[var(--glass-border-hover)] focus:text-[var(--text-main)] focus:ring-offset-[var(--bg-color)]",
    ghost: "bg-transparent border border-transparent text-[var(--text-muted)] hover:bg-[var(--ghost-btn-hover)] hover:text-[var(--text-main)] focus:ring-[var(--glass-border-hover)] focus:ring-offset-[var(--bg-color)]"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function GlassToast({ title, message, type = 'default', isVisible, onClose }: any) {
  if (!isVisible) return null;
  return createPortal(
    <div className="fixed bottom-6 right-6 bg-[var(--glass-bg)] backdrop-blur-[40px] border border-[var(--glass-border-hover)] rounded-[20px] p-4 shadow-[var(--glass-shadow-hover)] animate-in slide-in-from-bottom-5 fade-in flex items-start gap-4 z-[110] min-w-[300px]">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : type === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {type === 'success' ? <polyline points="20 6 9 17 4 12" /> : type === 'error' ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : <circle cx="12" cy="12" r="10" />}
        </svg>
      </div>
      <div className="flex flex-col pr-6">
        <h4 className="text-[14px] font-semibold text-[var(--text-main)]">{title}</h4>
        <p className="text-[13px] text-[var(--text-muted)] mt-1 pr-2">{message}</p>
      </div>
      <button onClick={onClose} className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>,
    document.body
  );
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Buttons');
  const [isToastOpen, setIsToastOpen] = useState(false);
  
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className={`relative w-full h-screen overflow-hidden bg-[var(--bg-color)] text-[var(--text-main)] font-sans transition-colors duration-500 ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Atmosphere and glowing orbs */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        <div 
          className="absolute inset-0 transition-all duration-1000" 
          style={{
            background: `radial-gradient(circle at 20% 20%, var(--bg-grad-1) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--bg-grad-2) 0%, transparent 40%), radial-gradient(circle at 50% 50%, var(--bg-grad-3) 0%, var(--bg-grad-4) 100%)`
          }}
        />
        <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[var(--orb-opacity)] bg-[var(--orb-1)] transition-colors duration-1000 z-[1]" />
        <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[calc(var(--orb-opacity)*0.4)] bg-[var(--orb-2)] transition-colors duration-1000 z-[1]" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-10 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-[0_0_20px_rgba(99,102,241,0.15)]" />
            <span className="text-[20px] font-bold tracking-tight">Liquid Glass UI</span>
            <span className="font-mono text-[11px] py-[2px] px-2 bg-[var(--code-bg)] border border-[var(--code-border)] rounded text-[#6366f1]">v0.4.2</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-[var(--text-muted)]">
            <span className="cursor-pointer hover:text-[var(--text-main)] transition-colors">Documentation</span>
            <span className="cursor-pointer hover:text-[var(--text-main)] transition-colors">Playground</span>
            <span className="text-[var(--text-main)] cursor-pointer mr-2">GitHub</span>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--secondary-btn-bg)] border border-[var(--glass-border)] text-[var(--text-main)] transition-all hover:bg-[var(--secondary-btn-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--glass-border-hover)]"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-[280px_1fr] gap-10 grow min-h-0">
          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 font-semibold">Get Started</span>
              <button 
                onClick={() => setActivePage('Introduction')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Introduction' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Introduction</button>
              <button 
                onClick={() => setActivePage('Installation')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Installation' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Installation</button>
              <button 
                onClick={() => setActivePage('Theming')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Theming' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Theming</button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 font-semibold">Core Components</span>
              <button 
                onClick={() => setActivePage('Buttons')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Buttons' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Buttons</button>
              <button 
                onClick={() => setActivePage('Inputs')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Inputs' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Inputs</button>
              <button 
                onClick={() => setActivePage('Data Display')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Data Display' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Data Display</button>
              <button 
                onClick={() => setActivePage('Feedback')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Feedback' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Feedback</button>
              <button 
                onClick={() => setActivePage('Overlays')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Overlays' ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] backdrop-blur-[10px]' : 'border border-transparent text-[var(--text-muted)] hover:bg-[var(--secondary-btn-hover)]'}`}>Overlays (Modal, Toast)</button>
            </div>
          </aside>

          <main className="flex flex-col gap-6 relative overflow-y-auto pb-20">
            {activePage === 'Buttons' && (
               <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
                <div className="flex flex-col gap-6 flex-1 w-full min-w-0">
                  {/* Showcased Card */}
                  <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                    <h2 className="text-[24px] font-semibold mb-2">GlassButton</h2>
                    <p className="text-[var(--text-muted)] text-[14px] mb-8">Highly customizable interactive surfaces with dynamic backdrop blur and refraction effects.</p>

                    <div className="flex flex-col gap-8">
                      <div>
                        <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">Variants</h4>
                        <div className="flex flex-wrap gap-4 items-center">
                          <GlassButton variant="primary" onClick={() => setIsModalOpen(true)}>Primary</GlassButton>
                          <GlassButton variant="secondary">Secondary</GlassButton>
                          <GlassButton variant="ghost">Ghost</GlassButton>
                          <GlassButton variant="destructive">Destructive</GlassButton>
                          <GlassButton variant="link">Link</GlassButton>
                        </div>
                      </div>

                      <div className="h-px bg-[var(--glass-border)] w-full" />

                      <div>
                        <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">Sizes & States</h4>
                        <div className="flex flex-wrap gap-4 items-center">
                          <GlassButton variant="primary" size="sm">Small</GlassButton>
                          <GlassButton variant="primary" size="md">Medium</GlassButton>
                          <GlassButton variant="primary" size="lg">Large</GlassButton>
                          <GlassButton variant="secondary" loading={true}>Processing</GlassButton>
                          <GlassButton variant="secondary" disabled={true}>Disabled</GlassButton>
                        </div>
                      </div>

                      <div className="h-px bg-[var(--glass-border)] w-full" />

                      <div>
                        <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">With Icons</h4>
                        <div className="flex flex-wrap gap-4 items-center">
                          <GlassButton variant="secondary" LeftIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>
                            Download
                          </GlassButton>
                          <GlassButton variant="primary" RightIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}>
                            Get Started
                          </GlassButton>
                          <GlassButton variant="ghost" size="icon" aria-label="Settings">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                          </GlassButton>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[var(--glass-border)] hidden">
                      <h3 className="text-[18px] font-semibold mb-2">GlassIconButton</h3>
                      <p className="text-[var(--text-muted)] text-[14px] mb-6">Optimized for iconography with equal scale and circular borders.</p>
                      <div className="flex gap-4 items-center flex-wrap">
                        <GlassIconButton variant="primary">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </GlassIconButton>
                        <GlassIconButton variant="secondary">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        </GlassIconButton>
                        <GlassIconButton variant="ghost">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </GlassIconButton>
                      </div>
                    </div>
                  </div>

                  {/* Code Block Snippet */}
                  <div className="bg-[var(--code-bg)] rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-indigo-400 border border-[var(--code-border)] w-full overflow-x-auto">
                    <div><span className="text-pink-400">&lt;GlassButton</span></div>
                    <div className="pl-4"><span className="text-emerald-400">variant</span>=<span className="text-amber-400">"primary"</span></div>
                    <div className="pl-4"><span className="text-emerald-400">glow</span>=<span className="text-amber-400">&#123;true&#125;</span></div>
                    <div className="pl-4"><span className="text-emerald-400">onClick</span>=<span className="text-amber-400">&#123;() =&gt; initialize()&#125;</span></div>
                    <div><span className="text-pink-400">&gt;</span></div>
                    <div className="pl-4 text-[var(--text-main)]">Launch Application</div>
                    <div><span className="text-pink-400">&lt;/GlassButton&gt;</span></div>
                  </div>
                </div>

                {/* Floating Modal Showcase is now structured in flow on the right in large screens */}
                <div className="w-full xl:w-[320px] shrink-0 bg-[var(--glass-bg)] backdrop-blur-[40px] border border-[var(--glass-border-hover)] rounded-[20px] p-6 shadow-[var(--glass-shadow-hover)] animate-in fade-in slide-in-from-bottom-4 xl:slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[18px] font-semibold text-[var(--text-main)]">System Update</h3>
                    <div className="w-4 h-4 bg-indigo-500/20 rounded-full animate-pulse border border-indigo-500/30"></div>
                  </div>
                  <p className="text-[13px] text-[var(--text-muted)] leading-[1.5] mb-6">
                    The liquid glass engine is now ready to compile your new library structure. Proceed with the deployment?
                  </p>
                  <div className="flex flex-col gap-3">
                    <button className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-[#6366f1] text-[var(--primary-btn-text)] text-[13px] font-semibold shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400">
                      Confirm
                    </button>
                    <button className="w-full py-2.5 px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--secondary-btn-bg)] text-[var(--text-main)] text-[13px] font-semibold transition-all hover:bg-[var(--secondary-btn-hover)]">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'Introduction' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
              <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#6366f1] to-[#c026d3] opacity-[var(--orb-opacity)] blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
                <h2 className="text-[28px] font-bold tracking-tight mb-4 text-[var(--text-main)] bg-clip-text">Introduction</h2>
                <p className="text-[var(--text-muted)] text-[16px] mb-8 leading-relaxed max-w-2xl">
                  Liquid Glass UI is a modern, design-first component library built for React and Tailwind CSS. It introduces a "Liquid Glass" (Glassmorphism) aesthetic, perfect for immersive user interfaces that blend depth, refraction, and translucent surfaces.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[var(--code-bg)] border border-[var(--code-border)] rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <h3 className="text-[16px] font-medium mb-2 text-[var(--text-main)]">Craftsmanship over defaults</h3>
                    <p className="text-[var(--text-muted)] text-[14px] leading-relaxed">
                      Instead of shipping a generic clone, this library gives your application a highly specific, modern identity right out of the box.
                    </p>
                  </div>
                  <div className="bg-[var(--code-bg)] border border-[var(--code-border)] rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-4">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h3 className="text-[16px] font-medium mb-2 text-[var(--text-main)]">Accessible & Beautiful</h3>
                    <p className="text-[var(--text-muted)] text-[14px] leading-relaxed">
                      We meticulously balance contrast ratios with translucent backgrounds, ensuring an immersive experience that doesn't compromise readability.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setActivePage('Installation')} className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-[var(--primary-btn-text)] text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400">
                    Get Started
                  </button>
                  <button onClick={() => setActivePage('Buttons')} className="py-3 px-6 rounded-xl border border-[var(--glass-border)] bg-[var(--secondary-btn-bg)] text-[var(--text-main)] text-[14px] font-semibold text-center transition-all hover:bg-[var(--secondary-btn-hover)]">
                    Explore Components
                  </button>
                </div>
              </div>
              </div>
            )}

            {activePage === 'Installation' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
              <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">Installation</h2>
                <p className="text-[var(--text-muted)] text-[15px] mb-8">Learn how to install Liquid Glass UI and configure your project workspace.</p>
                
                <h3 className="text-[16px] font-medium mb-3 text-[var(--text-main)]">1. Install Package</h3>
                <div className="bg-[var(--code-bg)] rounded-xl p-4 font-mono text-[13px] text-[#34d399] border border-[var(--code-border)] mb-8 overflow-x-auto">
                  npm install liquid-glass-ui
                </div>

                <h3 className="text-[16px] font-medium mb-3 text-[var(--text-main)]">2. Configure Tailwind</h3>
                <p className="text-[var(--text-muted)] text-[14px] mb-4">Add the Liquid Glass plugin to your <code className="text-[#a5b4fc] bg-indigo-500/10 px-1 rounded">tailwind.config.js</code> or plugin imports.</p>
                <div className="bg-[var(--code-bg)] rounded-xl p-4 font-mono text-[13px] text-[#a5b4fc] border border-[var(--code-border)] overflow-x-auto whitespace-pre-wrap">
                  import &#123; glassPlugin &#125; from 'liquid-glass-ui/tailwind';{'\n\n'}
                  export default &#123;{'\n'}
                  {'  '}plugins: [glassPlugin()],{'\n'}
                  &#125;
                </div>
              </div>
              </div>
            )}

            {activePage === 'Theming' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
              <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">Theming Architecture</h2>
                <p className="text-[var(--text-muted)] text-[15px] mb-8">Liquid Glass UI embraces customizability while retaining its signature aesthetic.</p>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center text-indigo-400">💧</div>
                    <div>
                      <h4 className="text-[16px] font-medium text-[var(--text-main)] mb-1">Global Glass Parameters</h4>
                      <p className="text-[var(--text-muted)] text-[14px] leading-relaxed">
                        You can override the base glass parameters such as blur radius, border opacity, and background tint using CSS variables globally or via local utility classes provided by our Tailwind plugin.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex-shrink-0 flex items-center justify-center text-fuchsia-400">✨</div>
                    <div>
                      <h4 className="text-[16px] font-medium text-[var(--text-main)] mb-1">Decoupled Accent Glows</h4>
                      <p className="text-[var(--text-muted)] text-[14px] leading-relaxed">
                        Accent glows are decoupled from component states, meaning you can easily re-theme primary buttons or active inputs to match your brand colors without losing the volumetric light dispersion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activePage === 'Modals' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
              <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">GlassModal</h2>
                <p className="text-[var(--text-muted)] text-[15px] mb-8">A highly polished modal component using React portals to render an overlay with deep backdrop blurs, focus trapping, and keyboard support.</p>
                <div className="flex flex-col gap-4">
                  <span className="text-[12px] font-medium text-[var(--text-muted)]">Interactive Demo</span>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-[var(--primary-btn-text)] text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)] max-w-xs"
                  >
                    Open Modal
                  </button>
                </div>
              </div>

              {/* Code Block Snippet */}
              <div className="bg-[var(--code-bg)] rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-indigo-400 border border-[var(--code-border)] animate-in fade-in slide-in-from-bottom-2 w-full overflow-x-auto">
                <div><span className="text-pink-400">&lt;GlassModal</span></div>
                <div className="pl-4"><span className="text-emerald-400">isOpen</span>=<span className="text-amber-400">&#123;isOpen&#125;</span></div>
                <div className="pl-4"><span className="text-emerald-400">onClose</span>=<span className="text-amber-400">&#123;() =&gt; setIsOpen(false)&#125;</span></div>
                <div className="pl-4"><span className="text-emerald-400">title</span>=<span className="text-amber-400">"System Update"</span></div>
                <div><span className="text-pink-400">&gt;</span></div>
                <div className="pl-4 text-[var(--text-main)]">
                  &lt;p&gt;Content goes here&lt;/p&gt;
                </div>
                <div><span className="text-pink-400">&lt;/GlassModal&gt;</span></div>
              </div>
              </div>
            )}

            {activePage === 'Cards' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
              <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">GlassCard</h2>
                <p className="text-[var(--text-muted)] text-[15px] mb-8">A versatile container for text, images, or forms, demonstrating perfect padding and corner radius.</p>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] font-medium text-[var(--text-muted)]">Interactive Demo</span>
                    <div className="relative p-8 sm:p-12 rounded-2xl overflow-hidden flex items-center justify-center border border-[var(--glass-border)] bg-[var(--bg-color)]">
                      <div className="absolute inset-0 glass-pattern opacity-[0.03] dark:opacity-[0.05]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--orb-1)_0%,transparent_60%)] opacity-20" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1] rounded-full blur-3xl opacity-30" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c026d3] rounded-full blur-3xl opacity-30" />
                      
                      <GlassCard 
                        title="Project Alpha" 
                        description="This is an internal prototype of the new rendering engine. It uses web workers to offload heavy calculations."
                        className="max-w-md w-full relative z-10 !shadow-2xl"
                      >
                        <button className="py-2.5 px-5 mt-4 rounded-xl border border-[var(--glass-border)] bg-[var(--secondary-btn-bg)] text-[var(--text-main)] text-[13px] font-semibold text-center transition-all hover:bg-[var(--secondary-btn-hover)] hover:shadow-lg">
                          View Details
                        </button>
                      </GlassCard>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Block Snippet */}
              <div className="bg-[var(--code-bg)] rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-indigo-400 border border-[var(--code-border)] animate-in fade-in slide-in-from-bottom-2 w-full overflow-x-auto">
                <div><span className="text-pink-400">&lt;GlassCard</span></div>
                <div className="pl-4"><span className="text-emerald-400">title</span>=<span className="text-amber-400">"Project Alpha"</span></div>
                <div className="pl-4"><span className="text-emerald-400">description</span>=<span className="text-amber-400">"This is an internal prototype..."</span></div>
                <div><span className="text-pink-400">&gt;</span></div>
                <div className="pl-4 text-[var(--text-main)]">
                  &lt;button&gt;View Details&lt;/button&gt;
                </div>
                <div><span className="text-pink-400">&lt;/GlassCard&gt;</span></div>
              </div>
              </div>
            )}

            {activePage === 'Inputs' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
                <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">GlassInput</h2>
                  <p className="text-[var(--text-muted)] text-[15px] mb-8">Sleek, blur-backed input fields with volumetric focus states.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                      <GlassInput 
                        label="Email Address"
                        placeholder="you@example.com"
                        type="email"
                      />
                      <GlassInput 
                        label="Secure Password"
                        placeholder="••••••••"
                        type="password"
                      />
                    </div>
                  </div>
                </div>

                {/* Code Block Snippet */}
                <div className="bg-[var(--code-bg)] rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-indigo-400 border border-[var(--code-border)] animate-in fade-in slide-in-from-bottom-2 w-full overflow-x-auto">
                  <div><span className="text-pink-400">&lt;GlassInput</span></div>
                  <div className="pl-4"><span className="text-emerald-400">label</span>=<span className="text-amber-400">"Email Address"</span></div>
                  <div className="pl-4"><span className="text-emerald-400">type</span>=<span className="text-amber-400">"email"</span></div>
                  <div className="pl-4"><span className="text-emerald-400">placeholder</span>=<span className="text-amber-400">"you@example.com"</span></div>
                  <div><span className="text-pink-400">/&gt;</span></div>
                </div>
              </div>
            )}

            {activePage === 'Data Display' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
                <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">Data Display</h2>
                  <p className="text-[var(--text-muted)] text-[15px] mb-8">Components to display compact information elegantly.</p>
                  
                  <div className="flex flex-col gap-8">
                    <div>
                      <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">Badges</h4>
                      <div className="flex flex-wrap gap-4 items-center">
                        <GlassBadge>Default</GlassBadge>
                        <GlassBadge variant="primary">Primary</GlassBadge>
                        <GlassBadge variant="success">Success</GlassBadge>
                        <GlassBadge variant="warning">Warning</GlassBadge>
                        <GlassBadge variant="destructive">Destructive</GlassBadge>
                      </div>
                    </div>

                    <div className="h-px bg-[var(--glass-border)] w-full" />
                    
                    <div>
                      <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">Avatars</h4>
                      <div className="flex flex-wrap gap-6 items-end">
                        <GlassAvatar size="sm" fallback="SM" />
                        <GlassAvatar size="md" fallback="MD" />
                        <GlassAvatar size="lg" fallback="LG" src="https://i.pravatar.cc/150?u=123" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Block Snippet */}
                <div className="bg-[var(--code-bg)] rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-indigo-400 border border-[var(--code-border)] animate-in fade-in slide-in-from-bottom-2 w-full overflow-x-auto">
                  <div><span className="text-pink-400">&lt;GlassBadge</span></div>
                  <div className="pl-4"><span className="text-emerald-400">variant</span>=<span className="text-amber-400">"success"</span></div>
                  <div><span className="text-pink-400">&gt;</span><span className="text-[var(--text-main)]">Completed</span><span className="text-pink-400">&lt;/GlassBadge&gt;</span></div>
                </div>
              </div>
            )}

            {activePage === 'Feedback' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
                <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">Feedback</h2>
                  <p className="text-[var(--text-muted)] text-[15px] mb-8">Inform users about the state of their actions.</p>
                  
                  <div className="flex flex-col gap-8">
                    <div>
                      <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">Alerts</h4>
                      <div className="flex flex-col gap-4">
                        <GlassAlert type="info" title="Update available">
                          A new version of the library is ready to be installed.
                        </GlassAlert>
                        <GlassAlert type="success" title="Deployment successful">
                          Your changes have been deployed to production.
                        </GlassAlert>
                        <GlassAlert type="warning" title="Approaching limit">
                          You have used 80% of your allocated bandwidth this period.
                        </GlassAlert>
                        <GlassAlert type="destructive" title="Connection failed">
                          Unable to connect to the server. Please check your network.
                        </GlassAlert>
                      </div>
                    </div>

                    <div className="h-px bg-[var(--glass-border)] w-full" />
                    
                    <div>
                      <h4 className="text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-4 font-semibold">Spinners</h4>
                      <div className="flex flex-wrap gap-8 items-center bg-[var(--bg-color)] p-6 rounded-xl border border-[var(--glass-border)]">
                        <div className="flex flex-col gap-3 items-center">
                          <GlassSpinner size="sm" />
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">sm</span>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                          <GlassSpinner size="md" />
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">md</span>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                          <GlassSpinner size="lg" />
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">lg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'Overlays' && (
              <div className="flex flex-col gap-6 w-full max-w-3xl">
                <div className="bg-[var(--glass-bg)] backdrop-blur-[24px] border border-[var(--glass-border)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[var(--glass-shadow)] animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-[24px] font-semibold mb-2 text-[var(--text-main)]">GlassToast (Overlay)</h2>
                  <p className="text-[var(--text-muted)] text-[15px] mb-8">Non-blocking notification overlays using React portals and backdrop blur.</p>
                  
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] font-medium text-[var(--text-muted)]">Interactive Demo</span>
                    <button 
                      onClick={() => setIsToastOpen(true)}
                      className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-[var(--primary-btn-text)] text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)] max-w-xs"
                    >
                      Trigger Notification
                    </button>
                  </div>
                </div>

                {/* Code Block Snippet */}
                <div className="bg-[var(--code-bg)] rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-indigo-400 border border-[var(--code-border)] animate-in fade-in slide-in-from-bottom-2 w-full overflow-x-auto">
                  <div><span className="text-pink-400">&lt;GlassToast</span></div>
                  <div className="pl-4"><span className="text-emerald-400">isVisible</span>=<span className="text-amber-400">&#123;isToastOpen&#125;</span></div>
                  <div className="pl-4"><span className="text-emerald-400">onClose</span>=<span className="text-amber-400">&#123;() =&gt; setIsToastOpen(false)&#125;</span></div>
                  <div className="pl-4"><span className="text-emerald-400">title</span>=<span className="text-amber-400">"Deployment Successful"</span></div>
                  <div className="pl-4"><span className="text-emerald-400">message</span>=<span className="text-amber-400">"Your application has been published."</span></div>
                  <div className="pl-4"><span className="text-emerald-400">type</span>=<span className="text-amber-400">"success"</span></div>
                  <div><span className="text-pink-400">/&gt;</span></div>
                </div>
              </div>
            )}

            <GlassModal
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="Initialize Deployment"
            >
              <p className="text-[14px] text-[var(--text-muted)] leading-[1.5] mb-8">
                You are about to launch the liquid glass UI components into production. 
                This action will trigger an automatic build and cannot be easily undone.
                Do you wish to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 px-4 rounded-xl border border-white/20 bg-[#6366f1] text-[var(--primary-btn-text)] text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)]"
                  onClick={() => setIsModalOpen(false)}
                >
                  Deploy Now
                </button>
                <button
                  className="flex-1 py-3 px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--secondary-btn-bg)] text-[var(--text-main)] text-[14px] font-semibold text-center transition-all hover:bg-[var(--secondary-btn-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--glass-border-hover)] focus:ring-offset-2 focus:ring-offset-[var(--bg-color)]"
                  onClick={() => setIsModalOpen(false)}
                >
                  Review Logs
                </button>
              </div>
            </GlassModal>

            <GlassToast 
              isVisible={isToastOpen}
              onClose={() => setIsToastOpen(false)}
              title="Deployment Successful"
              message="Your application components have been compiled and published to the edge."
              type="success"
            />
          </main>
        </div>
      </div>
    </div>
    </ThemeContext.Provider>
  );
}
