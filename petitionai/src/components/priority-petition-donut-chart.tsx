"use client";

import * as React from "react";
import {  TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import SpinningProgress from "./spinning-progress";

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
import { getOrganizationUser } from "@/actions/organizationUser";
import { getPetitionsCount } from "@/actions/petition";

const chartConfig = {
  high: { label: "High Priority", color: "hsl(0, 80%, 50%)" },
  medium: { label: "Medium Priority", color: "hsl(40, 90%, 55%)" },
  low: { label: "Low Priority", color: "hsl(140, 70%, 45%)" },
} satisfies ChartConfig;

type PetitionCount = {
  High: number;
  Low: number;
  Medium: number;
  total: number;
  date: string;
};

export function PriorityDonutChart({
  userType,
  userId,
  organizationUserId,
}: {
  userType?: "OrganizationUser";
  userId?: string;
  organizationUserId?: string;
}) {
  const {
    data: organizationUserData,
    isPending: orgUserPending,
    error: orgError,
  } = useQuery({
    queryKey: ["organization-user", userId],
    queryFn: async () => await getOrganizationUser(userId || ""),
  });

  const {
    isPending,
    error,
    data: petitionCount,
  } = useQuery({
    queryKey: ["petition-all-severity-count", organizationUserData, userType],
    queryFn: () => {
      if (
        userType === "OrganizationUser" &&
        organizationUserData?.organizationId
      ) {
        return getPetitionsCount(
          organizationUserData?.organizationId,
          organizationUserData?.departmentId,
          organizationUserData?.id,
          null,
          null
        );
      } else {
        return getPetitionsCount(
          organizationUserId || "",
          null,
          null,
          null,
          null
        );
      }
    },
  });

  const filteredChartData: PetitionCount[] = React.useMemo(
    () => petitionCount || [],
    [petitionCount]
  );

  const total = React.useMemo(
    () => ({
      total: filteredChartData.reduce((acc, curr) => acc + curr.total, 0),
      High: filteredChartData.reduce((acc, curr) => acc + curr.High, 0),
      Medium: filteredChartData.reduce((acc, curr) => acc + curr.Medium, 0),
      Low: filteredChartData.reduce((acc, curr) => acc + curr.Low, 0),
    }),
    [filteredChartData]
  );

  const chartData = [
    { priority: "High", count: total.High, fill: "hsl(0, 80%, 50%)" },
    { priority: "Medium", count: total.Medium, fill: "hsl(40, 90%, 55%)" },
    { priority: "Low", count: total.Low, fill: "hsl(140, 70%, 45%)" },
  ];

  if (isPending || orgUserPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error || orgError) {
    return (
      <div className="w-full h-full bg-gray-100 p-6 flex flex-col text-red-500 text-center py-10">
        Error loading petition details. {error?.message || orgError?.message}
      </div>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Petition Priorities</CardTitle>
        <CardDescription>Distribution of petitions by priority</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="priority"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Petitions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing petition priority distribution{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
