src/app/results/[n]/page.tsx
import ResultsClient from '@/components/queen-solver/ResultsClient';
import { solveNQueensAllSolutions } from '@/lib/nqueens'; // solveNQueensOneSolution no longer needed here
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ResultsPageProps {
  params: { n: string };
  searchParams: { /* solution?: string; allSolutionsCount?: string; */ }; // These are no longer strictly needed for core logic
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const n = parseInt(params.n, 10);

  if (isNaN(n) || n < 1 || n > 12) { 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md text-center shadow-xl">
                <CardHeader>
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-2xl text-destructive">Invalid N Value</CardTitle>
                    <CardDescription>
                        The number of queens (N) must be an integer between 1 and 12.
                    </CardDescription>
                </CardHeader>
                 <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/input-queens">Select N</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  const allSolutions = solveNQueensAllSolutions(n);
  // allSolutionsCount is derived from allSolutions.length in ResultsClient

  // No specific error here if allSolutions is empty (e.g., for N=2, N=3)
  // ResultsClient will handle the display for zero solutions.
  // The previous "Solution Display Error" for inconsistent single solution is removed
  // as we now pass all solutions.

  return <ResultsClient n={n} allSolutionsRaw={allSolutions} />;
}
