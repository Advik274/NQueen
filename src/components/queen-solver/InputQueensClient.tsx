"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { generateRandomNValue } from '@/ai/flows/random-n-value';
import { solveNQueensOneSolution } from '@/lib/nqueens';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function InputQueensClient() {
  const router = useRouter();
  const [selectedN, setSelectedN] = useState<string>('');
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const { toast } = useToast();

  const handleRandom = async () => {
    setIsLoadingRandom(true);
    try {
      const randomN = await generateRandomNValue();
      toast({ title: "Generated Random N", description: `N = ${randomN} selected.` });
      
      // Solve directly and navigate to results as per "Random Queen Placement" feature description
      const solution = solveNQueensOneSolution(randomN);
      if (solution) {
        router.push(`/results/${randomN}?solution=${JSON.stringify(solution)}`);
      } else {
        toast({
          title: "Error",
          description: `Could not find a solution for N = ${randomN}. This is unexpected.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating random N or solving:", error);
      toast({
        title: "Error",
        description: "Failed to generate random N or find a solution.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handleStartSimulation = () => {
    if (!selectedN) {
      toast({
        title: "Selection Missing",
        description: "Please select a number of Queens (N).",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingStart(true);
    router.push(`/solver/${selectedN}`);
  };

  const N_OPTIONS = Array.from({ length: 12 - 4 + 1 }, (_, i) => (i + 4).toString());

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary">Number of Queens</CardTitle>
          <CardDescription>Select the number of Queens (N) for the N-Queen problem.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="n-select" className="text-base">Select N (4 to 12)</Label>
            <Select value={selectedN} onValueChange={setSelectedN}>
              <SelectTrigger id="n-select" className="w-full text-base">
                <SelectValue placeholder="Choose N..." />
              </SelectTrigger>
              <SelectContent>
                {N_OPTIONS.map(n => (
                  <SelectItem key={n} value={n} className="text-base">
                    {n} Queens
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRandom} className="w-full sm:w-auto flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground" disabled={isLoadingRandom || isLoadingStart}>
            {isLoadingRandom && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Try Random
          </Button>
          <Button onClick={handleStartSimulation} className="w-full sm:w-auto flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!selectedN || isLoadingRandom || isLoadingStart}>
             {isLoadingStart && selectedN && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Simulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
