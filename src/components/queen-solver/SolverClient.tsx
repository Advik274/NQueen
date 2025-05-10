"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Chessboard from './Chessboard';
import type { QueenPosition } from '@/lib/nqueens';
import { getAnimationPlacementSteps, solveNQueensOneSolution } from '@/lib/nqueens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Loader2, Play, Pause, FastForward, RotateCcw, SkipForward, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SolverClientProps {
  initialN: number;
}

const MIN_SPEED_MS = 200; // 0.2s
const MAX_SPEED_MS = 2000; // 2s
const DEFAULT_SPEED_MS = 1000; // 1s

export default function SolverClient({ initialN }: SolverClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [n, setN] = useState<number>(initialN);
  const [queens, setQueens] = useState<QueenPosition[]>([]);
  const [animationSteps, setAnimationSteps] = useState<QueenPosition[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(DEFAULT_SPEED_MS); // ms per step
  const [solution, setSolution] = useState<number[] | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    const steps = getAnimationPlacementSteps(n);
    const sol = solveNQueensOneSolution(n);
    
    if (!sol || steps.length === 0) {
        toast({
            title: "No Solution Found",
            description: `Could not find a solution for N=${n}. This might happen for N < 4.`,
            variant: "destructive",
        });
        router.push('/input-queens'); // Go back if no solution
        return;
    }

    setAnimationSteps(steps);
    setSolution(sol);
    setQueens(steps[0] || []);
    setCurrentStep(0);
    setIsSolved(false);
    setIsPlaying(true);
  }, [n, router, toast]);

  useEffect(() => {
    if (!isPlaying || currentStep >= animationSteps.length -1 || isSolved) {
      if (currentStep >= animationSteps.length -1 && animationSteps.length > 0) {
        setIsSolved(true);
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setQueens(animationSteps[currentStep + 1] || animationSteps[animationSteps.length - 1]);
    }, animationSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, animationSteps, animationSpeed, isSolved]);

  const togglePlayPause = () => setIsPlaying(prev => !prev);

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(MAX_SPEED_MS + MIN_SPEED_MS - value[0]); // Slider is visually inverse to speed
  };
  
  const increaseSpeed = () => setAnimationSpeed(prev => Math.max(MIN_SPEED_MS, prev - 200));
  const decreaseSpeed = () => setAnimationSpeed(prev => Math.min(MAX_SPEED_MS, prev + 200));

  const resetAnimation = () => {
    setCurrentStep(0);
    setQueens(animationSteps[0] || []);
    setIsPlaying(true);
    setIsSolved(false);
  };

  const skipToResult = () => {
    if (solution) {
      router.push(`/results/${n}?solution=${JSON.stringify(solution)}`);
    } else {
       toast({ title: "Error", description: "Solution not available to skip.", variant: "destructive" });
    }
  };

  if (animationSteps.length === 0 && !solution) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading N-Queen Solver for N={n}...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary">N-Queen Solver: {n}x{n}</CardTitle>
          <CardDescription>
            {isSolved ? "Solution found!" : `Visualizing queen placement... Step ${currentStep + 1} of ${animationSteps.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Chessboard sizeN={n} queens={queens} className="mx-auto max-w-full w-[500px] h-auto aspect-square" />
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
                <Button variant="outline" size="icon" onClick={decreaseSpeed} title="Decrease Speed (Slower)">
                    <Minus className="h-5 w-5" />
                </Button>
                <Label htmlFor="speed-slider" className="sr-only">Animation Speed</Label>
                 <Slider
                    id="speed-slider"
                    min={MIN_SPEED_MS}
                    max={MAX_SPEED_MS}
                    step={100}
                    value={[MAX_SPEED_MS + MIN_SPEED_MS - animationSpeed]} // Slider is visually inverse to speed
                    onValueChange={handleSpeedChange}
                    className="w-full max-w-xs"
                    aria-label="Animation speed control"
                />
                <Button variant="outline" size="icon" onClick={increaseSpeed} title="Increase Speed (Faster)">
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
                Current speed: {((animationSpeed)/1000).toFixed(1)}s per step
            </p>
           
            <div className="flex justify-center items-center space-x-3 pt-2">
                <Button onClick={togglePlayPause} variant="outline" size="icon" title={isPlaying ? "Pause" : "Play"} disabled={isSolved}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button onClick={resetAnimation} variant="outline" size="icon" title="Reset Animation">
                    <RotateCcw className="h-6 w-6" />
                </Button>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
          <Button onClick={() => router.push('/input-queens')} variant="secondary" className="w-full sm:w-auto">
            Change N
          </Button>
          <Button onClick={skipToResult} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!solution}>
            <SkipForward className="mr-2 h-5 w-5" />
            Show Result Instantly
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
