"use client";

import type { QueenPosition } from '@/lib/nqueens';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';

interface ChessboardProps {
  sizeN: number;
  queens: QueenPosition[];
  className?: string;
}

export default function Chessboard({ sizeN, queens, className }: ChessboardProps) {
  const boardCells = [];

  for (let r = 0; r < sizeN; r++) {
    for (let c = 0; c < sizeN; c++) {
      const isDark = (r + c) % 2 !== 0;
      const queen = queens.find(q => q.row === r && q.col === c);

      boardCells.push(
        <div
          key={`${r}-${c}`}
          className={cn(
            "aspect-square flex items-center justify-center",
            isDark ? 'bg-primary' : 'bg-background', // Dark: #003366, Light: #f0f0f0
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
    gridTemplateColumns: `repeat(${sizeN}, minmax(0, 1fr))`,
  };

  return (
    <div 
      className={cn("grid border border-border shadow-lg rounded-md overflow-hidden", className)} 
      style={gridStyle}
      role="grid"
      aria-label={`Chessboard of size ${sizeN}x${sizeN}`}
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
