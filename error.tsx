import React from 'react';
import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';

export default function ServerErrorPage() {
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-8 h-8"
        />
        <span className="text-lg font-semibold text-neutral-900">
          Your Company
        </span>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
            <ServerCrash className="w-8 h-8 text-neutral-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Server Error
            </h1>
            <p className="text-neutral-600">
              Something went wrong on our end. Please try again.
            </p>
          </div>

          <Button 
            onClick={handleTryAgain}
            className="bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            Try Again
          </Button>

          <p className="text-sm text-neutral-500">
            Error Code: 500 - Internal Server Error
          </p>
        </div>
      </div>
    </div>
  );
}
