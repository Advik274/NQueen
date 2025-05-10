import SolverClient from '@/components/queen-solver/SolverClient';

interface SolverPageProps {
  params: { n: string };
}

export default function SolverPage({ params }: SolverPageProps) {
  const n = parseInt(params.n, 10);

  if (isNaN(n) || n < 4 || n > 12) {
    // Or a more user-friendly error display / redirect
    return <div className="flex items-center justify-center min-h-screen">Invalid N value. Please select N between 4 and 12.</div>;
  }
  
  return <SolverClient initialN={n} />;
}
