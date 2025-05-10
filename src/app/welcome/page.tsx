"use client"; // Needs to be client for useRouter

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground p-4">
      <Card className="w-full max-w-md text-center shadow-2xl bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary">Welcome to Queen Solver</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Visualize the classic N-Queen problem using AI-powered insights and animations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            size="lg" 
            className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground w-full"
            onClick={() => router.push('/input-queens')}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
      <footer className="absolute bottom-4 text-sm text-primary-foreground/70">
        Powered by NextJS & ShadCN UI
      </footer>
    </div>
  );
}
