"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage({ error }: { error?: Error }) {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-red-50">
      <div className="flex flex-col items-center space-y-4 p-6 rounded-lg shadow-lg bg-white">
        <AlertCircle className="h-12 w-12 text-red-600" />
        <h2 className="text-2xl font-semibold text-red-700">Something went wrong</h2>
        {error?.message && <p className="text-gray-600">{error.message}</p>}
        <Button onClick={() => router.refresh()} variant="default">
          Try Again
        </Button>
      </div>
    </div>
  );
}
