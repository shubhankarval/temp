import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  const handleRequestAccess = () => {
    // Replace with your access request URL
    window.location.href = '/request-access';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-neutral-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Access Denied
          </h1>
          <p className="text-neutral-600">
            You don't have permission to view this page
          </p>
        </div>

        <Button 
          onClick={handleRequestAccess}
          className="bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          Request Access
        </Button>

        <p className="text-sm text-neutral-500">
          Error Code: 401 - Unauthorized
        </p>
      </div>
    </div>
  );
}
