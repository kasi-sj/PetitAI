"use client";

import {  TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getPetitionsCountByDepartment } from "@/actions/petition";
import React from "react";
import SpinningProgress from "@/components/spinning-progress";

const chartConfig = {
  department: {
    label: "Departments",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function DepartmentRadarChart({
  organizationUserId,
}: {
  organizationUserId: string;
}) {
  const {
    isPending,
    error,
    data: petitionCount,
  } = useQuery({
    queryKey: ["petition-all-severity-count", organizationUserId],
    queryFn: () => getPetitionsCountByDepartment(organizationUserId),
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 p-6 flex flex-col text-red-500 text-center py-10">
        Error loading petition details. {error?.message}
      </div>
    );
  }

  console.log(petitionCount);

  interface PetitionCount {
    name: string;
    count: number;
  }

  const chartData: { department: string; value: number }[] = petitionCount.map(
    (dept: PetitionCount) => ({
      department: dept.name,
      value: dept.count,
    })
  );

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Department Performance</CardTitle>
        <CardDescription>
          Visualizing department contributions over the last quarter.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="department" />
            <PolarGrid />
            <Radar
              dataKey="value"
              stroke="var(--color-department)"
              fill="var(--color-department)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Department performance <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
