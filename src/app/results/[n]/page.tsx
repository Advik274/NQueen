import ResultsClient from '@/components/queen-solver/ResultsClient';
import { solveNQueensOneSolution, solveNQueensAllSolutions, type QueenPosition } from '@/lib/nqueens';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface ResultsPageProps {
  params: { n: string };
  searchParams: { solution?: string; allSolutionsCount?: string };
}

export default function ResultsPage({ params, searchParams }: ResultsPageProps) {
  const n = parseInt(params.n, 10);
  let solutionArray: number[] | null = null;
  let queenPositions: QueenPosition[] = [];
  let allSolutionsCount = 0;

  if (isNaN(n) || n < 1 || n > 12) { // N can be 1, but typical range is 4-12 for this app
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

  if (searchParams.allSolutionsCount) {
    allSolutionsCount = parseInt(searchParams.allSolutionsCount, 10);
    if (isNaN(allSolutionsCount)) allSolutionsCount = 0;
  } else {
    // If count not passed, calculate it. This might be slow for large N if not pre-calculated.
    const allSolutions = solveNQueensAllSolutions(n);
    allSolutionsCount = allSolutions.length;
  }

  if (searchParams.solution) {
    try {
      solutionArray = JSON.parse(searchParams.solution);
      if (!Array.isArray(solutionArray) || solutionArray.length !== n || solutionArray.some(val => typeof val !== 'number')) {
        solutionArray = null; // Invalid solution format
      }
    } catch (e) {
      console.error("Failed to parse solution from URL", e);
      solutionArray = null;
    }
  }
  
  // If solution wasn't passed or was invalid, try to compute one
  if (!solutionArray) {
    solutionArray = solveNQueensOneSolution(n);
  }

  if (solutionArray) {
    queenPositions = solutionArray.map((col, row) => ({ row, col }));
  } else {
     // This case means no solution could be found/determined for display (e.g. N=2,3 or error)
     // But allSolutionsCount might still be 0 correctly for N=2,3.
     // If allSolutionsCount > 0 but solutionArray is null, it's an inconsistency.
     // For N=2 or N=3, solveNQueensOneSolution returns null, and allSolutionsCount will be 0.
     if (n === 2 || n === 3) {
         // Specific handling for N=2, N=3 where no solutions exist
         return <ResultsClient n={n} solutionArray={null} queenPositions={[]} allSolutionsCount={0} />;
     }

     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <Card className="w-full max-w-md text-center shadow-xl">
                <CardHeader>
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-2xl text-destructive">Solution Display Error</CardTitle>
                    <CardDescription>
                        Could not determine a specific solution to display for N={n}, even though {allSolutionsCount} solutions might exist.
                    </CardDescription>
                </CardHeader>
                 <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/input-queens">Try Again</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
     );
  }

  return <ResultsClient n={n} solutionArray={solutionArray} queenPositions={queenPositions} allSolutionsCount={allSolutionsCount} />;
}
