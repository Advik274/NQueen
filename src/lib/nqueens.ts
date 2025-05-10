export interface QueenPosition {
  row: number;
  col: number;
}

// Helper function to check if placing a queen at (row, col) is safe
// given the queens already placed in `placements` up to `row - 1`.
function isSafe(row: number, col: number, placements: readonly number[]): boolean {
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

// Returns the first solution as an array where index is row and value is column
export function solveNQueensOneSolution(n: number): number[] | null {
  if (n < 1) return null;
  // N=2 and N=3 have no solutions, but standard N-Queens often starts at N=4.
  // N=1 solution is [0].
  if (n === 2 || n === 3) return null;


  const placements: number[] = new Array(n);

  function solve(currentRow: number): boolean {
    if (currentRow === n) {
      return true; // All queens placed
    }

    for (let currentCol = 0; currentCol < n; currentCol++) {
      if (isSafe(currentRow, currentCol, placements)) {
        placements[currentRow] = currentCol;
        if (solve(currentRow + 1)) {
          return true;
        }
        // Backtrack is implicit: placements[currentRow] will be overwritten or loop ends
      }
    }
    return false;
  }

  if (solve(0)) {
    return placements;
  }
  return null;
}

// Returns all solutions for N-Queens
export function solveNQueensAllSolutions(n: number): number[][] {
  const allSolutions: number[][] = [];
  if (n < 1) return allSolutions;
  if (n === 2 || n === 3) return allSolutions; // No solutions for N=2 or N=3

  const placements: number[] = new Array(n);

  function solve(row: number) {
    if (row === n) {
      allSolutions.push(placements.slice());
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col, placements)) {
        placements[row] = col;
        solve(row + 1);
        // No explicit un-placement needed here as placements[row] will be overwritten by the next iteration,
        // or the function will return if all columns for this row are tried.
      }
    }
  }

  solve(0);
  return allSolutions;
}


// Generates steps for animating the placement of queens based on the first solution (linear placement)
// This function will be replaced by backtracking animation but kept for reference or specific use cases.
export function getAnimationPlacementSteps(n: number): QueenPosition[][] {
    const solution = solveNQueensOneSolution(n);
    const steps: QueenPosition[][] = [];
    if (solution) {
        // Initial empty board state
        steps.push([]);
        for (let i = 0; i < solution.length; i++) {
            const currentStepQueens: QueenPosition[] = [];
            for (let r = 0; r <= i; r++) {
                currentStepQueens.push({ row: r, col: solution[r] });
            }
            steps.push(currentStepQueens);
        }
    } else {
      steps.push([]); // Show empty board if no solution
    }
    return steps;
}

// Generates detailed steps for visualizing the backtracking algorithm
export function getBacktrackingAnimationSteps(n: number): {
  animationStates: QueenPosition[][];
  solutionsFoundIndices: number[]; // Indices in animationStates that represent a full solution
  allSolutionsRaw: number[][]; // All solutions in number[] format
} {
  const animationStates: QueenPosition[][] = [];
  const solutionsFoundIndices: number[] = [];
  const allSolutionsRaw: number[][] = [];
  
  // placements[row] = col means a queen is at (row, col)
  // -1 means no queen in that row yet for the current path
  const placements: number[] = new Array(n).fill(-1); 

  function convertToQueenPositions(currentPlacements: readonly number[], N: number): QueenPosition[] {
    const queens: QueenPosition[] = [];
    for (let r = 0; r < N; r++) {
      if (currentPlacements[r] !== -1) {
        queens.push({ row: r, col: currentPlacements[r] });
      }
    }
    return queens;
  }
  
  // Initial state: empty board
  animationStates.push([]);

  function solveAndRecord(row: number) {
    if (row === n) {
      // Solution found
      allSolutionsRaw.push(placements.slice());
      // The state that forms the solution is the one *before* this call,
      // which was the last placement that completed the board.
      // So, the latest state in animationStates is a solution.
      if (animationStates.length > 0) {
        solutionsFoundIndices.push(animationStates.length - 1);
      }
      return;
    }

    for (let col = 0; col < n; col++) {
      // Try placing queen at (row, col)
      placements[row] = col;
      animationStates.push(convertToQueenPositions(placements, n));

      if (isSafe(row, col, placements)) {
        solveAndRecord(row + 1);
      }
      // If not safe, or if solveAndRecord(row + 1) returned (backtracked),
      // the queen at (row, col) is implicitly "removed" or "invalidated" for this path
      // as we try the next column or backtrack further up.
      // The state showing this attempt (placements[row]=col) has already been pushed.
    }
    
    // Backtrack: tried all columns for 'row', so remove queen from 'row'
    placements[row] = -1;
    animationStates.push(convertToQueenPositions(placements, n));
  }
  
  if (n > 0 && n !== 2 && n !== 3) { // Only run solver for N where solutions might exist
    solveAndRecord(0);
  }


  // If the last state is identical to the second to last (often due to final backtrack step)
  // and it's not a solution state, remove it to avoid static end to animation.
  if (animationStates.length >= 2) {
    const lastState = JSON.stringify(animationStates[animationStates.length - 1].sort((a,b) => a.row - b.row || a.col - b.col));
    const secondLastState = JSON.stringify(animationStates[animationStates.length - 2].sort((a,b) => a.row - b.row || a.col - b.col));
    if (lastState === secondLastState && !solutionsFoundIndices.includes(animationStates.length -1) ) {
        // However, be careful if the very last step is removal to empty, and initial was empty.
        // For now, let's keep this simple. The primary goal is to show the algorithm's flow.
    }
  }
  
  // Ensure there's at least one state (empty board) if no solving happened.
  if (animationStates.length === 0) {
      animationStates.push([]);
  }

  return { animationStates, solutionsFoundIndices, allSolutionsRaw };
}
