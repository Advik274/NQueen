"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Chessboard from './Chessboard';
import type { QueenPosition } from '@/lib/nqueens';
import { getBacktrackingAnimationSteps } from '@/lib/nqueens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Loader2, Play, Pause, RotateCcw, SkipForward, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SolverClientProps {
  initialN: number;
}

const MIN_SPEED_MS = 100; 
const MAX_SPEED_MS = 2000;
const DEFAULT_SPEED_MS = 500; 

export default function SolverClient({ initialN }: SolverClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [n, setN] = useState<number>(initialN);
  
  const [queens, setQueens] = useState<QueenPosition[]>([]);
  const [animationStates, setAnimationStates] = useState<QueenPosition[][]>([]);
  const [solutionsFoundIndices, setSolutionsFoundIndices] = useState<number[]>([]);
  const [allSolutionsRaw, setAllSolutionsRaw] = useState<number[][]>([]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(DEFAULT_SPEED_MS);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentSolutionDisplayIndex, setCurrentSolutionDisplayIndex] = useState<number>(0); // For tracking which solution # is found

  useEffect(() => {
    setIsLoading(true);
    const { 
      animationStates: newAnimationStates, 
      solutionsFoundIndices: newSolutionsFoundIndices, 
      allSolutionsRaw: newAllSolutionsRaw 
    } = getBacktrackingAnimationSteps(n);
    
    setAnimationStates(newAnimationStates);
    setSolutionsFoundIndices(newSolutionsFoundIndices);
    setAllSolutionsRaw(newAllSolutionsRaw);

    if (newAnimationStates.length > 0) {
      setQueens(newAnimationStates[0] || []);
    } else {
      setQueens([]); 
    }
    
    setCurrentStep(0);
    setIsPlaying(true);
    setCurrentSolutionDisplayIndex(0);
    setIsLoading(false);

    if (newAllSolutionsRaw.length === 0 && newAnimationStates.length <=1 && (n === 2 || n === 3 || n < 1) ) { 
        toast({
            title: "No Solutions Possible",
            description: `The N-Queen problem has no solutions for N=${n}.`,
            variant: "destructive",
        });
    }

  }, [n, toast]);

  useEffect(() => {
    if (!isPlaying || currentStep >= animationStates.length -1 || isLoading) {
      if (currentStep >= animationStates.length -1 && animationStates.length > 0 && !isLoading) {
        setIsPlaying(false); // Animation ended
        if (allSolutionsRaw.length === 0 && (n !==2 && n !== 3 && n>=1)) {
             toast({
                title: "Search Complete",
                description: `No solutions found for N=${n} after exploring all possibilities.`,
                variant: "default",
            });
        } else if (allSolutionsRaw.length > 0) {
             toast({
                title: `Search Complete: ${allSolutionsRaw.length} Solution(s) Found`,
                description: `All possible placements explored for N=${n}.`,
            });
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setQueens(animationStates[nextStep] || []);
      if (solutionsFoundIndices.includes(nextStep)) {
        const newIndex = solutionsFoundIndices.indexOf(nextStep);
        setCurrentSolutionDisplayIndex(newIndex + 1);
        toast({
            title: `Solution ${newIndex + 1} Found!`,
            description: `A valid placement for ${n} queens. Animation will continue...`
        });
      }
    }, animationSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, animationStates, animationSpeed, isLoading, solutionsFoundIndices, toast, allSolutionsRaw.length, n]);

  const togglePlayPause = () => setIsPlaying(prev => !prev);

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(MAX_SPEED_MS + MIN_SPEED_MS - value[0]);
  };
  
  const increaseSpeed = () => setAnimationSpeed(prev => Math.max(MIN_SPEED_MS, prev - 100));
  const decreaseSpeed = () => setAnimationSpeed(prev => Math.min(MAX_SPEED_MS, prev + 100));

  const resetAnimation = () => {
    if (animationStates.length > 0) {
      setCurrentStep(0);
      setQueens(animationStates[0] || []);
      setIsPlaying(true);
      setCurrentSolutionDisplayIndex(0);
       if (solutionsFoundIndices.includes(0)) {
         setCurrentSolutionDisplayIndex(1);
       }
    }
  };

  const skipToResult = () => {
    if (allSolutionsRaw.length > 0) {
      router.push(`/results/${n}`);
    } else {
       toast({ title: "No Solution Found", description: `Cannot skip to results as no solution has been found for N=${n}.`, variant: "destructive" });
    }
  };
  
  const getStatusMessage = () => {
    if (isLoading) return `Loading animation for N=${n}...`;
    if (currentStep >= animationStates.length -1) {
      return allSolutionsRaw.length > 0 ? 
        `Animation complete. Found ${allSolutionsRaw.length} solution(s).` :
        `Animation complete. No solutions found for N=${n}.`;
    }
    if (solutionsFoundIndices.includes(currentStep)) {
        return `Solution ${currentSolutionDisplayIndex} found! Step ${currentStep + 1} of ${animationStates.length}.`;
    }
    return `Visualizing... Step ${currentStep + 1} of ${animationStates.length}.`;
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading N-Queen Solver for N={n}...</p>
      </div>
    );
  }
  
  if (animationStates.length <= 1 && allSolutionsRaw.length === 0 && (n === 2 || n === 3 || n < 1)) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="items-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <CardTitle className="text-2xl font-semibold text-destructive">No Solution Possible for N={n}</CardTitle>
            <CardDescription>The N-Queen problem does not have a solution for this N value.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/input-queens')} className="w-full">
              Try a Different N
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 space-y-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary text-center">N-Queen Solver: {n}x{n}</CardTitle>
          <CardDescription className="text-center min-h-[20px]">
            {getStatusMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Chessboard 
            sizeN={n} 
            queens={queens} 
            className="mx-auto max-w-full w-[400px] sm:w-[500px] h-auto aspect-square"
            isSolutionState={solutionsFoundIndices.includes(currentStep)}
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">Controls</CardTitle>
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
                    step={50}
                    value={[MAX_SPEED_MS + MIN_SPEED_MS - animationSpeed]}
                    onValueChange={handleSpeedChange}
                    className="w-full max-w-xs"
                    aria-label="Animation speed control"
                />
                <Button variant="outline" size="icon" onClick={increaseSpeed} title="Increase Speed (Faster)">
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
                Speed: {((animationSpeed)/1000).toFixed(2)}s per step
            </p>
           
            <div className="flex justify-center items-center space-x-3 pt-2">
                <Button onClick={togglePlayPause} variant="outline" size="icon" title={isPlaying ? "Pause" : "Play"} disabled={currentStep >= animationStates.length -1}>
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
          <Button onClick={skipToResult} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={allSolutionsRaw.length === 0}>
            <SkipForward className="mr-2 h-5 w-5" />
            Show All Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
