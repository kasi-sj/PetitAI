"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getPetitionsCount } from "@/actions/petition";
import { getOrganizationUser } from "@/actions/organizationUser";
import SpinningProgress from "./spinning-progress";

// Update the chart configuration to use the same keys as the incoming data
const chartConfig = {
  total: { label: "Total Petitions", color: "hsl(210, 90%, 40%)" },
  High: { label: "High Priority", color: "hsl(0, 80%, 50%)" },
  Medium: { label: "Medium Priority", color: "hsl(40, 90%, 55%)" },
  Low: { label: "Low Priority", color: "hsl(140, 70%, 45%)" },
} satisfies ChartConfig;

type PetitionCount = {
  High: number;
  Low: number;
  Medium: number;
  total: number;
  date: string;
};

export function DailyPetitionCount({
  userType,
  userId,
  organizationUserId,
}: {
  userType?: "OrganizationUser";
  userId?: string;
  organizationUserId?: string;
}) {
  // Set initial active chart to "total" (matching our data key)
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total");
  const [chartType, setChartType] = React.useState<"bar" | "line">("bar");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
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
    queryKey: [
      "petition-count",
      organizationUserData,
      userType,
      startDate,
      endDate,
    ],
    queryFn: () => {
      if (userType === "OrganizationUser") {
        if (organizationUserData?.organizationId) {
          return getPetitionsCount(
            organizationUserData?.organizationId,
            organizationUserData?.departmentId,
            organizationUserData?.id,
            startDate,
            endDate
          );
        }
      } else {
        return getPetitionsCount(
          organizationUserId || "",
          null,
          null,
          startDate,
          endDate
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
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Petition Count</CardTitle>
          <CardDescription>
            View petitions submitted in a specific date range.
          </CardDescription>
        </div>
        <div className="flex">
          {["total", "High", "Medium", "Low"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* Date Range Selector & Chart Type Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-100 border-b">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Start Date:</label>
          <input
            type="date"
            className="p-2 border rounded-md text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="text-sm font-medium">End Date:</label>
          <input
            type="date"
            className="p-2 border rounded-md text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
        >
          Switch to {chartType === "bar" ? "Line" : "Bar"} Chart
        </button>
      </div>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {chartType === "bar" ? (
            <BarChart
              accessibilityLayer
              data={filteredChartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => dayjs(value).format("MMM DD")}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) =>
                      dayjs(value).format("MMM DD, YYYY")
                    }
                  />
                }
              />
              <Bar
                dataKey="total"
                fill={chartConfig["total"].color}
                stackId="0"
              />
              {activeChart === "total" && (
                <Bar
                  dataKey="High"
                  fill={chartConfig["High"].color}
                  stackId="1"
                />
              )}
              {activeChart === "total" && (
                <Bar
                  dataKey="Medium"
                  fill={chartConfig["Medium"].color}
                  stackId="1"
                />
              )}
              {activeChart === "total" && (
                <Bar
                  dataKey="Low"
                  fill={chartConfig["Low"].color}
                  stackId="1"
                />
              )}
              {activeChart !== "total" && (
                <Bar
                  dataKey={activeChart}
                  fill={chartConfig[activeChart].color}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          ) : (
            <LineChart
              accessibilityLayer
              data={filteredChartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => dayjs(value).format("MMM DD")}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) =>
                      dayjs(value).format("MMM DD, YYYY")
                    }
                  />
                }
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke={chartConfig["total"].color}
                strokeWidth={2}
              />
              {activeChart === "total" && (
                <Line
                  type="monotone"
                  dataKey="High"
                  stroke={chartConfig["High"].color}
                  strokeWidth={2}
                />
              )}
              {activeChart === "total" && (
                <Line
                  type="monotone"
                  dataKey="Medium"
                  stroke={chartConfig["Medium"].color}
                  strokeWidth={2}
                />
              )}
              {activeChart === "total" && (
                <Line
                  type="monotone"
                  dataKey="Low"
                  stroke={chartConfig["Low"].color}
                  strokeWidth={2}
                />
              )}
              {activeChart !== "total" && (
                <Line
                  type="monotone"
                  dataKey={activeChart}
                  stroke={chartConfig[activeChart].color}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
