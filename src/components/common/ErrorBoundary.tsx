import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'অপ্রত্যাশিত ত্রুটি' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Al Hidayah Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-lg border border-stone-200">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-base font-bold text-stone-900 mb-1">
              আল হিদায়াহ অডিও
            </h1>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              একটি সাময়িক ত্রুটি হয়েছে। অ্যাপ্লিকেশনটি রিলোড করে পুনরায় চেষ্টা করুন।
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RotateCw className="w-4 h-4" />
                <span>অ্যাপ রিলোড করুন</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
