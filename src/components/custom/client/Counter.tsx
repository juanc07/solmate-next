"use client"; // This tells Next.js that this is a client-side component

import { useStore } from '@/lib/useStore';
import { Button } from '@/components/ui/button'; // Import the ShadCN button

export default function Counter() {
  const { count, increase, reset } = useStore();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Count: {count}</h1>
      
      {/* Using shadcn/ui Button */}
      <div className="space-x-2">
        <Button variant="default" onClick={increase}>
          Increase
        </Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
