import React from "react";
import SpinningProgress from "@/components/spinning-progress";

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <SpinningProgress size={8} />
      </div>
    </div>
  );
}
