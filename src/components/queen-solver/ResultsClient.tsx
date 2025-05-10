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
  solutionArray: number[] | null; // Can be null if no solution (e.g. N=2,3)
  queenPositions: QueenPosition[];
  allSolutionsCount: number;
}

export default function ResultsClient({ n, solutionArray, queenPositions, allSolutionsCount }: ResultsClientProps) {
  const router = useRouter();

  const formattedSolutionArray = solutionArray ? `[${solutionArray.join(', ')}]` : "N/A";
  const formattedQueenPositions = queenPositions.length > 0 
    ? queenPositions.map(q => `(${q.row + 1}, ${String.fromCharCode(65 + q.col)})`).join(', ')
    : "N/A";

  const titleText = allSolutionsCount > 0 && solutionArray 
    ? `🎉 Solution Displayed for ${n}x${n}` 
    : allSolutionsCount === 0 
    ? `ℹ️ No Solutions for ${n}x${n}`
    : `ℹ️ Problem Info for ${n}x${n}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 space-y-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            {solutionArray ? <CheckCircle2 className="h-12 w-12 text-green-500" /> : <AlertTriangle className="h-12 w-12 text-yellow-500" />}
          </div>
          <CardTitle className="text-3xl font-bold text-primary">{titleText}</CardTitle>
          <CardDescription>
            Found a total of <strong>{allSolutionsCount}</strong> possible solution(s) for N={n}.
            {solutionArray && allSolutionsCount > 1 && " (Displaying one of them)"}
            {(n === 2 || n === 3) && " N=2 and N=3 are known to have no solutions."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {solutionArray && <Chessboard sizeN={n} queens={queenPositions} className="mx-auto max-w-full w-[300px] sm:w-[400px] h-auto aspect-square" />}
          
          {solutionArray && (
            <div className="space-y-3 pt-4">
              <div>
                <h3 className="font-semibold text-lg text-primary">Displayed Solution Array (0-indexed):</h3>
                <ScrollArea className="h-16 w-full rounded-md border p-2 bg-secondary/50">
                  <p className="text-sm font-mono text-secondary-foreground">{formattedSolutionArray}</p>
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">Displayed Queen Positions (1-indexed, Row, Col-Letter):</h3>
                 <ScrollArea className="h-16 w-full rounded-md border p-2 bg-secondary/50">
                  <p className="text-sm font-mono text-secondary-foreground">{formattedQueenPositions}</p>
                </ScrollArea>
              </div>
            </div>
          )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-center sm:text-left">
                <div>
                    <h3 className="font-semibold text-lg text-primary">Time Complexity (Typical Backtracking):</h3>
                    <p className="text-sm text-muted-foreground">O(N!)</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-primary">Space Complexity (Typical Backtracking):</h3>
                    <p className="text-sm text-muted-foreground">O(N)</p>
                </div>
            </div>
        </CardContent>
        <CardFooter>
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
