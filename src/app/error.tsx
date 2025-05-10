"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="bg-card p-8 rounded-lg shadow-xl max-w-md w-full">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-destructive mb-4">Oops! Something Went Wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 mb-6">Error Digest: {error.digest}</p>
        )}
        <Button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
