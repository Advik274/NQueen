"use client";

import type { QueenPosition } from '@/lib/nqueens';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';

interface ChessboardProps {
  sizeN: number;
  queens: QueenPosition[];
  className?: string;
  isSolutionState?: boolean; // New prop for highlighting
}

export default function Chessboard({ sizeN, queens, className, isSolutionState = false }: ChessboardProps) {
  const boardCells = [];
  const cellTotalSize = sizeN + 1; // For labels

  // Column Labels (A, B, ...)
  for (let c = 0; c < cellTotalSize; c++) {
    boardCells.push(
      <div
        key={`label-col-${c}`}
        className={cn(
          "aspect-square flex items-center justify-center text-xs font-medium text-muted-foreground",
          c === 0 ? "bg-transparent" : "bg-transparent" // Top-left corner vs col labels
        )}
      >
        {c > 0 ? String.fromCharCode(64 + c) : ''}
      </div>
    );
  }

  for (let r = 0; r < sizeN; r++) {
    // Row Label (1, 2, ...)
    boardCells.push(
      <div
        key={`label-row-${r}`}
        className="aspect-square flex items-center justify-center text-xs font-medium text-muted-foreground bg-transparent"
      >
        {r + 1}
      </div>
    );

    // Board Cells
    for (let c = 0; c < sizeN; c++) {
      const isDark = (r + c) % 2 !== 0;
      const queen = queens.find(q => q.row === r && q.col === c);

      boardCells.push(
        <div
          key={`${r}-${c}`}
          className={cn(
            "aspect-square flex items-center justify-center border border-border/30",
            isDark ? 'bg-primary/80' : 'bg-background', 
            "transition-colors duration-300"
          )}
          data-testid={`cell-${r}-${c}`}
        >
          {queen && (
            <QueenIcon className="w-3/4 h-3/4 text-accent animate-fadeIn" data-testid={`queen-${r}-${c}`} />
          )}
        </div>
      );
    }
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${cellTotalSize}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${cellTotalSize}, minmax(0, auto))`, // Ensure labels fit
  };

  return (
    <div 
      className={cn(
        "grid shadow-lg rounded-md overflow-hidden bg-card p-1 transition-all duration-300",
        isSolutionState ? "border-2 border-accent ring-2 ring-accent ring-offset-background ring-offset-2" : "border border-border",
        className
      )} 
      style={gridStyle}
      role="grid"
      aria-label={`Chessboard of size ${sizeN}x${sizeN}${isSolutionState ? ', solution highlighted' : ''}`}
    >
      {boardCells}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
