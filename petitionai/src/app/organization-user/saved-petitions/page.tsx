import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Organization User Saved Petitions</CardTitle>
          <CardDescription>
            A future module to display details of petitions saved by organization users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Placeholder for future dynamic content */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Button disabled>Feature Coming Soon</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
