import ResultsClient from '@/components/queen-solver/ResultsClient';
import { solveNQueensOneSolution, type QueenPosition } from '@/lib/nqueens';

interface ResultsPageProps {
  params: { n: string };
  searchParams: { solution?: string };
}

export default function ResultsPage({ params, searchParams }: ResultsPageProps) {
  const n = parseInt(params.n, 10);
  let solutionArray: number[] | null = null;
  let queenPositions: QueenPosition[] = [];

  if (isNaN(n) || n < 4 || n > 12) {
    return <div className="flex items-center justify-center min-h-screen">Invalid N value in URL.</div>;
  }

  if (searchParams.solution) {
    try {
      solutionArray = JSON.parse(searchParams.solution);
      if (!Array.isArray(solutionArray) || solutionArray.length !== n || solutionArray.some(isNaN)) {
        solutionArray = null; // Invalid solution format
      }
    } catch (e) {
      console.error("Failed to parse solution from URL", e);
      solutionArray = null;
    }
  }
  
  // If solution wasn't passed or was invalid, try to compute it
  if (!solutionArray) {
    solutionArray = solveNQueensOneSolution(n);
  }

  if (solutionArray) {
    queenPositions = solutionArray.map((col, row) => ({ row, col }));
  } else {
     return <div className="flex items-center justify-center min-h-screen">Could not find or determine a solution for N={n}.</div>;
  }

  return <ResultsClient n={n} solutionArray={solutionArray} queenPositions={queenPositions} />;
}
