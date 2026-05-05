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

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Introduction</button>
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Installation</button>
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Theming</button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[#94a3b8] mb-1 font-semibold">Components</span>
              <button className="px-4 py-3 rounded-[10px] text-[14px] bg-white/[0.04] border border-white/10 text-[#f8fafc] backdrop-blur-[10px] text-left transition-all">Buttons</button>
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Inputs</button>
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Modals</button>
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Cards</button>
              <button className="px-4 py-3 rounded-[10px] text-[14px] text-[#94a3b8] text-left transition-all hover:bg-white/[0.02]">Overlays</button>
            </div>
          </aside>

          <main className="flex flex-col gap-6 relative">
            {/* Showcased Card */}
            <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
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
                  <span className="text-[12px] font-medium text-[#94a3b8]">Input Field</span>
                  <input 
                    type="text" 
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] outline-none w-full focus:border-[#6366f1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] transition-all" 
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
            <div className="hidden lg:block absolute top-10 right-0 2xl:right-10 w-[300px] bg-white/[0.06] backdrop-blur-[40px] border border-white/[0.15] rounded-[20px] p-6 z-10 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
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
          </main>
        </div>
      </div>
    </div>
  );
}
