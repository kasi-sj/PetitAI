import SpinningProgress from "@/components/spinning-progress";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* <Loader2 className="h-10 w-10 animate-spin text-blue-600" /> */}
        <SpinningProgress size={8} />
      </div>
    </div>
  );
}
