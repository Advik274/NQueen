"use client";

import { useRouter } from 'next/navigation';
import Chessboard from './Chessboard';
import type { QueenPosition } from '@/lib/nqueens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ResultsClientProps {
  n: number;
  allSolutionsRaw: number[][]; 
}

export default function ResultsClient({ n, allSolutionsRaw }: ResultsClientProps) {
  const router = useRouter();
  const allSolutionsCount = allSolutionsRaw.length;

  const titleText = allSolutionsCount > 0
    ? `🎉 ${allSolutionsCount} Solution(s) Found for ${n}x${n}`
    : `ℹ️ No Solutions Found for ${n}x${n}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl shadow-xl my-6">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            {allSolutionsCount > 0 ? <CheckCircle2 className="h-12 w-12 text-green-500" /> : <AlertTriangle className="h-12 w-12 text-yellow-500" />}
          </div>
          <CardTitle className="text-3xl font-bold text-primary">{titleText}</CardTitle>
          <CardDescription>
            {allSolutionsCount > 0
              ? `Displaying all ${allSolutionsCount} unique solution(s) for N=${n}.`
              : `The N-Queen problem has no solutions for N=${n}.`}
            {(n === 2 || n === 3) && allSolutionsCount === 0 && " This is expected for N=2 and N=3."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {allSolutionsCount > 0 ? (
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4 bg-secondary/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                {allSolutionsRaw.map((solution, index) => {
                  const queenPositions = solution.map((col, row) => ({ row, col }));
                  const formattedSolutionArray = `[${solution.join(', ')}]`;
                  const formattedQueenPositions = queenPositions.length > 0 
                    ? queenPositions.map(q => `(${q.row + 1}, ${String.fromCharCode(65 + q.col)})`).join(', ')
                    : "N/A";

                  return (
                    <Card key={index} className="shadow-lg bg-card flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-primary">Solution ${index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
                        <Chessboard 
                          sizeN={n} 
                          queens={queenPositions} 
                          className="mx-auto max-w-full w-[200px] sm:w-[250px] h-auto aspect-square mb-3" 
                          isSolutionState={true} // All boards here are solutions
                        />
                        <div className="space-y-2 text-xs mt-auto">
                          <div>
                            <h4 className="font-semibold text-sm text-primary">Array (0-indexed):</h4>
                            <p className="font-mono text-secondary-foreground bg-muted/60 p-1.5 rounded break-all text-center">{formattedSolutionArray}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-primary">Positions (1-idx):</h4>
                            <ScrollArea className="h-12 w-full rounded-md border p-1 bg-muted/60">
                                <p className="font-mono text-secondary-foreground break-words whitespace-normal">{formattedQueenPositions}</p>
                            </ScrollArea>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                No solutions to display for N={n}.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-center sm:text-left border-t mt-8">
            <div>
              <h3 className="font-semibold text-lg text-primary">Time Complexity (Backtracking):</h3>
              <p className="text-sm text-muted-foreground">O(N!)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Space Complexity (Backtracking):</h3>
              <p className="text-sm text-muted-foreground">O(N) for recursion stack, O(N*M) for storing M solutions.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <Button 
            onClick={() => router.push('/input-queens')} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            Try Another N
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
