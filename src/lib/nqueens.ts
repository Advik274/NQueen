export interface QueenPosition {
  row: number;
  col: number;
}

// Returns the first solution as an array where index is row and value is column
export function solveNQueensOneSolution(n: number): number[] | null {
  if (n < 1) return null;
  if (n === 2 || n === 3) return null; // No solutions for N=2 or N=3

  const placements: number[] = new Array(n);

  function isSafe(row: number, col: number): boolean {
    for (let prevRow = 0; prevRow < row; prevRow++) {
      const prevCol = placements[prevRow];
      if (
        prevCol === col || // Same column
        Math.abs(prevRow - row) === Math.abs(prevCol - col) // Same diagonal
      ) {
        return false;
      }
    }
    return true;
  }

  function solve(row: number): boolean {
    if (row === n) {
      return true; // All queens placed
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        placements[row] = col;
        if (solve(row + 1)) {
          return true;
        }
        // Backtrack is implicit: placements[row] will be overwritten or loop ends
      }
    }
    return false;
  }

  if (solve(0)) {
    return placements;
  }
  return null; // Should not happen for N>=4
}

// Generates steps for animating the placement of queens based on the first solution
export function getAnimationPlacementSteps(n: number): QueenPosition[][] {
    const solution = solveNQueensOneSolution(n);
    const steps: QueenPosition[][] = [];
    if (solution) {
        for (let i = 0; i < solution.length; i++) {
            // Show queens placed up to row i
            const currentStepQueens: QueenPosition[] = [];
            for (let r = 0; r <= i; r++) {
                currentStepQueens.push({ row: r, col: solution[r] });
            }
            steps.push(currentStepQueens);
        }
    }
    return steps;
}
