import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in CinéScope:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0d15] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mb-4 shadow-xl">
            <span className="text-2xl">🎬</span>
          </div>
          <h1 className="text-xl font-bold font-display text-white mb-2">
            CinéScope — Chargement interrompu
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
            Une mise à jour a été appliquée. Appuyez sur le bouton ci-dessous pour rafraîchir l'application.
          </p>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((regs) => {
                    for (const r of regs) r.unregister();
                    window.location.reload();
                  }).catch(() => {
                    window.location.reload();
                  });
                } else {
                  window.location.reload();
                }
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95"
          >
            Rafraîchir CinéScope
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
