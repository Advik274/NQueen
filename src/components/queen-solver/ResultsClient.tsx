"use client";

import { useRouter } from 'next/navigation';
import Chessboard from './Chessboard';
import type { QueenPosition } from '@/lib/nqueens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsClientProps {
  n: number;
  solutionArray: number[] | null;
  queenPositions: QueenPosition[];
}

export default function ResultsClient({ n, solutionArray, queenPositions }: ResultsClientProps) {
  const router = useRouter();

  if (!solutionArray) {
    // This case should ideally be handled by the server component redirecting or showing an error
    return <div className="flex items-center justify-center min-h-screen">Error: Solution not available.</div>;
  }

  const formattedSolutionArray = `[${solutionArray.join(', ')}]`;
  const formattedQueenPositions = queenPositions.map(q => `(${q.row}, ${q.col})`).join(', ');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">🎉 Queens Successfully Placed! ({n}x{n})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Chessboard sizeN={n} queens={queenPositions} className="mx-auto max-w-full w-[400px] h-auto aspect-square" />
          
          <div className="space-y-3 pt-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">Solution Array:</h3>
              <ScrollArea className="h-16 w-full rounded-md border p-2 bg-secondary/50">
                <p className="text-sm font-mono text-secondary-foreground">{formattedSolutionArray}</p>
              </ScrollArea>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Queen Positions (Row, Column):</h3>
               <ScrollArea className="h-16 w-full rounded-md border p-2 bg-secondary/50">
                <p className="text-sm font-mono text-secondary-foreground">{formattedQueenPositions}</p>
              </ScrollArea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                    <h3 className="font-semibold text-lg text-primary">Time Complexity:</h3>
                    <p className="text-sm text-muted-foreground">O(N!)</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-primary">Space Complexity:</h3>
                    <p className="text-sm text-muted-foreground">O(N)</p>
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/input-queens')} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            Restart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
