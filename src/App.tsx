/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity" onClick={onClose} aria-hidden="true" />
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-[400px] bg-white/[0.06] backdrop-blur-[40px] border border-white/[0.15] rounded-[24px] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 id="modal-title" className="text-[18px] font-semibold text-[#f8fafc]">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
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
    <div className={`bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-[20px] font-semibold text-[#f8fafc] mb-1">{title}</h3>}
          {description && <p className="text-[#94a3b8] text-[14px] leading-relaxed">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function GlassInput({ label, placeholder, defaultValue, type = "text", className = '', ...props }: any) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[12px] font-medium text-[#94a3b8]">{label}</label>}
      <input 
        type={type}
        className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] outline-none w-full focus:border-[#6366f1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] transition-all placeholder:text-white/30" 
        placeholder={placeholder} 
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  );
}

function GlassToast({ title, message, type = 'default', isVisible, onClose }: any) {
  if (!isVisible) return null;
  return createPortal(
    <div className="fixed bottom-6 right-6 bg-white/[0.06] backdrop-blur-[40px] border border-white/[0.15] rounded-[20px] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-5 fade-in flex items-start gap-4 z-[110] min-w-[300px]">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : type === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {type === 'success' ? <polyline points="20 6 9 17 4 12" /> : type === 'error' ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : <circle cx="12" cy="12" r="10" />}
        </svg>
      </div>
      <div className="flex flex-col pr-6">
        <h4 className="text-[14px] font-semibold text-white">{title}</h4>
        <p className="text-[13px] text-[#94a3b8] mt-1 pr-2">{message}</p>
      </div>
      <button onClick={onClose} className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>,
    document.body
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Buttons');
  const [isToastOpen, setIsToastOpen] = useState(false);
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030306] text-[#f8fafc] font-sans">
      {/* Atmosphere and glowing orbs */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at 20% 20%, #1e1b4b 0%, transparent 40%), radial-gradient(circle at 80% 80%, #312e81 0%, transparent 40%), radial-gradient(circle at 50% 50%, #030306 0%, #000 100%)'
          }}
        />
        <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 bg-[#6366f1] z-[1]" />
        <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 bg-[#c026d3] z-[1]" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-10 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-[0_0_20px_rgba(99,102,241,0.15)]" />
            <span className="text-[20px] font-bold tracking-tight">Liquid Glass UI</span>
            <span className="font-mono text-[11px] py-[2px] px-2 bg-white/[0.04] border border-white/10 rounded text-[#6366f1]">v0.4.2</span>
          </div>
          <div className="flex gap-5 text-sm text-[#94a3b8]">
            <span className="cursor-pointer hover:text-[#f8fafc] transition-colors">Documentation</span>
            <span className="cursor-pointer hover:text-[#f8fafc] transition-colors">Playground</span>
            <span className="text-[#f8fafc] cursor-pointer">GitHub</span>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-[280px_1fr] gap-10 grow min-h-0">
          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[#94a3b8] mb-1 font-semibold">Get Started</span>
              <button 
                onClick={() => setActivePage('Introduction')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Introduction' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Introduction</button>
              <button 
                onClick={() => setActivePage('Installation')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Installation' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Installation</button>
              <button 
                onClick={() => setActivePage('Theming')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Theming' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Theming</button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[#94a3b8] mb-1 font-semibold">Components</span>
              <button 
                onClick={() => setActivePage('Buttons')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Buttons' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Buttons</button>
              <button 
                onClick={() => setActivePage('Inputs')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Inputs' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Inputs</button>
              <button 
                onClick={() => setActivePage('Modals')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Modals' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Modals</button>
              <button 
                onClick={() => setActivePage('Cards')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Cards' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Cards</button>
              <button 
                onClick={() => setActivePage('Overlays')}
                className={`px-4 py-3 rounded-[10px] text-[14px] text-left transition-all ${activePage === 'Overlays' ? 'bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px]' : 'border border-transparent text-[#94a3b8] hover:bg-white/[0.02]'}`}>Overlays</button>
            </div>
          </aside>

          <main className="flex flex-col gap-6 relative overflow-y-auto pb-20">
            {activePage === 'Buttons' && (
              <>
            {/* Showcased Card */}
            <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-[24px] font-semibold mb-2">GlassButton</h2>
              <p className="text-[#94a3b8] text-[14px] mb-8">Highly customizable interactive surfaces with dynamic backdrop blur and refraction effects.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <span className="text-[12px] font-medium text-[#94a3b8]">Primary Variant</span>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-white text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030306]">
                    Launch System
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-[12px] font-medium text-[#94a3b8]">Secondary Variant</span>
                  <button className="py-3 px-6 rounded-xl border border-white/10 bg-white/[0.04] text-white text-[14px] font-semibold text-center transition-all hover:bg-white/[0.08]">
                    View Metrics
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-[12px] font-medium text-[#94a3b8]">Ghost Variant</span>
                  <button className="py-3 px-6 rounded-xl border border-transparent bg-transparent text-white text-[14px] font-semibold text-center transition-all hover:bg-white/[0.04]">
                    Dismiss
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <GlassInput 
                    label="Input Field"
                    placeholder="Search components..."
                    defaultValue="Interface focus"
                  />
                </div>
              </div>
            </div>

            {/* Code Block Snippet */}
            <div className="bg-black/30 rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-[#a5b4fc] border border-white/[0.05]">
              <div><span className="text-[#f472b6]">&lt;GlassButton</span></div>
              <div className="pl-4"><span className="text-[#34d399]">variant</span>=<span className="text-[#fbbf24]">"primary"</span></div>
              <div className="pl-4"><span className="text-[#34d399]">glow</span>=<span className="text-[#fbbf24]">&#123;true&#125;</span></div>
              <div className="pl-4"><span className="text-[#34d399]">onClick</span>=<span className="text-[#fbbf24]">&#123;() =&gt; initialize()&#125;</span></div>
              <div><span className="text-[#f472b6]">&gt;</span></div>
              <div className="pl-4 text-slate-200">Launch Application</div>
              <div><span className="text-[#f472b6]">&lt;/GlassButton&gt;</span></div>
            </div>

            {/* Floating Modal Showcase */}
            <div className="hidden lg:block absolute top-10 right-0 2xl:right-10 w-[300px] bg-white/[0.06] backdrop-blur-[40px] border border-white/[0.15] rounded-[20px] p-6 z-10 shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[18px] font-semibold">System Update</h3>
                <div className="w-4 h-4 bg-white/20 rounded-full"></div>
              </div>
              <p className="text-[13px] text-[#94a3b8] leading-[1.5] mb-6">
                The liquid glass engine is now ready to compile your new library structure. Proceed with the deployment?
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 px-3 rounded-xl border border-white/20 bg-[#6366f1] text-white text-[12px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400">
                  Confirm
                </button>
                <button className="flex-1 py-2 px-3 rounded-xl border border-white/10 bg-white/[0.04] text-white text-[12px] font-semibold text-center transition-all hover:bg-white/[0.08]">
                  Cancel
                </button>
              </div>
            </div>
            </>
            )}

            {activePage === 'Introduction' && (
              <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#6366f1]/20 to-[#c026d3]/20 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
                <h2 className="text-[28px] font-bold tracking-tight mb-4 text-[#f8fafc] bg-clip-text">Introduction</h2>
                <p className="text-[#94a3b8] text-[16px] mb-8 leading-relaxed max-w-2xl">
                  Liquid Glass UI is a modern, design-first component library built for React and Tailwind CSS. It introduces a "Liquid Glass" (Glassmorphism) aesthetic, perfect for immersive user interfaces that blend depth, refraction, and translucent surfaces.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <h3 className="text-[16px] font-medium mb-2 text-white">Craftsmanship over defaults</h3>
                    <p className="text-[#94a3b8] text-[14px] leading-relaxed">
                      Instead of shipping a generic clone, this library gives your application a highly specific, modern identity right out of the box.
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-4">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h3 className="text-[16px] font-medium mb-2 text-white">Accessible & Beautiful</h3>
                    <p className="text-[#94a3b8] text-[14px] leading-relaxed">
                      We meticulously balance contrast ratios with translucent backgrounds, ensuring an immersive experience that doesn't compromise readability.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setActivePage('Installation')} className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-white text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400">
                    Get Started
                  </button>
                  <button onClick={() => setActivePage('Buttons')} className="py-3 px-6 rounded-xl border border-white/10 bg-white/[0.04] text-white text-[14px] font-semibold text-center transition-all hover:bg-white/[0.08]">
                    Explore Components
                  </button>
                </div>
              </div>
            )}

            {activePage === 'Installation' && (
              <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[#f8fafc]">Installation</h2>
                <p className="text-[#94a3b8] text-[15px] mb-8">Learn how to install Liquid Glass UI and configure your project workspace.</p>
                
                <h3 className="text-[16px] font-medium mb-3 text-[#f8fafc]">1. Install Package</h3>
                <div className="bg-black/30 rounded-xl p-4 font-mono text-[13px] text-[#34d399] border border-white/[0.05] mb-8 overflow-x-auto">
                  npm install liquid-glass-ui
                </div>

                <h3 className="text-[16px] font-medium mb-3 text-[#f8fafc]">2. Configure Tailwind</h3>
                <p className="text-[#94a3b8] text-[14px] mb-4">Add the Liquid Glass plugin to your <code className="text-[#a5b4fc] bg-indigo-500/10 px-1 rounded">tailwind.config.js</code> or plugin imports.</p>
                <div className="bg-black/30 rounded-xl p-4 font-mono text-[13px] text-[#a5b4fc] border border-white/[0.05] overflow-x-auto whitespace-pre-wrap">
                  import &#123; glassPlugin &#125; from 'liquid-glass-ui/tailwind';{'\n\n'}
                  export default &#123;{'\n'}
                  {'  '}plugins: [glassPlugin()],{'\n'}
                  &#125;
                </div>
              </div>
            )}

            {activePage === 'Theming' && (
              <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[#f8fafc]">Theming Architecture</h2>
                <p className="text-[#94a3b8] text-[15px] mb-8">Liquid Glass UI embraces customizability while retaining its signature aesthetic.</p>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center text-indigo-400">💧</div>
                    <div>
                      <h4 className="text-[16px] font-medium text-white mb-1">Global Glass Parameters</h4>
                      <p className="text-[#94a3b8] text-[14px] leading-relaxed">
                        You can override the base glass parameters such as blur radius, border opacity, and background tint using CSS variables globally or via local utility classes provided by our Tailwind plugin.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex-shrink-0 flex items-center justify-center text-fuchsia-400">✨</div>
                    <div>
                      <h4 className="text-[16px] font-medium text-white mb-1">Decoupled Accent Glows</h4>
                      <p className="text-[#94a3b8] text-[14px] leading-relaxed">
                        Accent glows are decoupled from component states, meaning you can easily re-theme primary buttons or active inputs to match your brand colors without losing the volumetric light dispersion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'Modals' && (
              <>
              <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[#f8fafc]">GlassModal</h2>
                <p className="text-[#94a3b8] text-[15px] mb-8">A highly polished modal component using React portals to render an overlay with deep backdrop blurs, focus trapping, and keyboard support.</p>
                <div className="flex flex-col gap-4">
                  <span className="text-[12px] font-medium text-[#94a3b8]">Interactive Demo</span>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-white text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030306] max-w-xs"
                  >
                    Open Modal
                  </button>
                </div>
              </div>

              {/* Code Block Snippet */}
              <div className="bg-black/30 rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-[#a5b4fc] border border-white/[0.05] animate-in fade-in slide-in-from-bottom-2">
                <div><span className="text-[#f472b6]">&lt;GlassModal</span></div>
                <div className="pl-4"><span className="text-[#34d399]">isOpen</span>=<span className="text-[#fbbf24]">&#123;isOpen&#125;</span></div>
                <div className="pl-4"><span className="text-[#34d399]">onClose</span>=<span className="text-[#fbbf24]">&#123;() =&gt; setIsOpen(false)&#125;</span></div>
                <div className="pl-4"><span className="text-[#34d399]">title</span>=<span className="text-[#fbbf24]">"System Update"</span></div>
                <div><span className="text-[#f472b6]">&gt;</span></div>
                <div className="pl-4 text-slate-200">
                  &lt;p&gt;Content goes here&lt;/p&gt;
                </div>
                <div><span className="text-[#f472b6]">&lt;/GlassModal&gt;</span></div>
              </div>
              </>
            )}

            {activePage === 'Cards' && (
              <>
              <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-[24px] font-semibold mb-2 text-[#f8fafc]">GlassCard</h2>
                <p className="text-[#94a3b8] text-[15px] mb-8">A versatile container for text, images, or forms, demonstrating perfect padding and corner radius.</p>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] font-medium text-[#94a3b8]">Interactive Demo</span>
                    <GlassCard 
                      title="Project Alpha" 
                      description="This is an internal prototype of the new rendering engine. It uses web workers to offload heavy calculations."
                      className="max-w-md"
                    >
                      <button className="py-2 px-4 mt-2 rounded-xl border border-white/10 bg-white/[0.04] text-white text-[13px] font-semibold text-center transition-all hover:bg-white/[0.08]">
                        View Details
                      </button>
                    </GlassCard>
                  </div>
                </div>
              </div>

              {/* Code Block Snippet */}
              <div className="bg-black/30 rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-[#a5b4fc] border border-white/[0.05] animate-in fade-in slide-in-from-bottom-2">
                <div><span className="text-[#f472b6]">&lt;GlassCard</span></div>
                <div className="pl-4"><span className="text-[#34d399]">title</span>=<span className="text-[#fbbf24]">"Project Alpha"</span></div>
                <div className="pl-4"><span className="text-[#34d399]">description</span>=<span className="text-[#fbbf24]">"This is an internal prototype..."</span></div>
                <div><span className="text-[#f472b6]">&gt;</span></div>
                <div className="pl-4 text-slate-200">
                  &lt;button&gt;View Details&lt;/button&gt;
                </div>
                <div><span className="text-[#f472b6]">&lt;/GlassCard&gt;</span></div>
              </div>
              </>
            )}

            {activePage === 'Inputs' && (
              <>
                <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-[24px] font-semibold mb-2 text-[#f8fafc]">GlassInput</h2>
                  <p className="text-[#94a3b8] text-[15px] mb-8">Sleek, blur-backed input fields with volumetric focus states.</p>
                  
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
                <div className="bg-black/30 rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-[#a5b4fc] border border-white/[0.05] animate-in fade-in slide-in-from-bottom-2">
                  <div><span className="text-[#f472b6]">&lt;GlassInput</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">label</span>=<span className="text-[#fbbf24]">"Email Address"</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">type</span>=<span className="text-[#fbbf24]">"email"</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">placeholder</span>=<span className="text-[#fbbf24]">"you@example.com"</span></div>
                  <div><span className="text-[#f472b6]">/&gt;</span></div>
                </div>
              </>
            )}

            {activePage === 'Overlays' && (
              <>
                <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-[24px] font-semibold mb-2 text-[#f8fafc]">GlassToast (Overlay)</h2>
                  <p className="text-[#94a3b8] text-[15px] mb-8">Non-blocking notification overlays using React portals and backdrop blur.</p>
                  
                  <div className="flex flex-col gap-4">
                    <span className="text-[12px] font-medium text-[#94a3b8]">Interactive Demo</span>
                    <button 
                      onClick={() => setIsToastOpen(true)}
                      className="py-3 px-6 rounded-xl border border-white/20 bg-[#6366f1] text-white text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030306] max-w-xs"
                    >
                      Trigger Notification
                    </button>
                  </div>
                </div>

                {/* Code Block Snippet */}
                <div className="bg-black/30 rounded-xl p-5 font-mono text-[13px] leading-[1.6] text-[#a5b4fc] border border-white/[0.05] animate-in fade-in slide-in-from-bottom-2">
                  <div><span className="text-[#f472b6]">&lt;GlassToast</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">isVisible</span>=<span className="text-[#fbbf24]">&#123;isToastOpen&#125;</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">onClose</span>=<span className="text-[#fbbf24]">&#123;() =&gt; setIsToastOpen(false)&#125;</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">title</span>=<span className="text-[#fbbf24]">"Deployment Successful"</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">message</span>=<span className="text-[#fbbf24]">"Your application has been published."</span></div>
                  <div className="pl-4"><span className="text-[#34d399]">type</span>=<span className="text-[#fbbf24]">"success"</span></div>
                  <div><span className="text-[#f472b6]">/&gt;</span></div>
                </div>
              </>
            )}

            <GlassModal
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="Initialize Deployment"
            >
              <p className="text-[14px] text-[#94a3b8] leading-[1.5] mb-8">
                You are about to launch the liquid glass UI components into production. 
                This action will trigger an automatic build and cannot be easily undone.
                Do you wish to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 px-4 rounded-xl border border-white/20 bg-[#6366f1] text-white text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030306]"
                  onClick={() => setIsModalOpen(false)}
                >
                  Deploy Now
                </button>
                <button
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-white text-[14px] font-semibold text-center transition-all hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#030306]"
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
  );
}
