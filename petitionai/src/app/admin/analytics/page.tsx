"use client";
import { getOrganization } from "@/actions/organization";
import { getUser } from "@/actions/user";
import { DailyPetitionCount } from "@/components/daily-petition-line-chart";
import { DepartmentRadarChart } from "@/components/department-petition-radar-chart";
import { PriorityDonutChart } from "@/components/priority-petition-donut-chart";
import { UserAnalyticsTable } from "@/components/user-analytics-table";
import { useUserStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SpinningProgress from "@/components/spinning-progress";


const Page = () => {
  const { user } = useUserStore();
  const userId = user?.userId;
  const {
    isPending,
    error,
    data: OrganizationData,
  } = useQuery({
    queryKey: ["organization-admin", userId],
    queryFn: async () => {
      const users = await getUser(userId || "");
      const user = users;
      console.log(user, "admin");
      return await getOrganization(user.adminOf.name || "");
    },
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
      <div>
        Error loading organization
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <div className="p-2">
        <DailyPetitionCount organizationUserId={OrganizationData.id || ""} />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <PriorityDonutChart organizationUserId={OrganizationData.id || ""} />
          <DepartmentRadarChart
            organizationUserId={OrganizationData.id || ""}
          />
        </div>
        <UserAnalyticsTable organizationName={OrganizationData.name || ""} />
      </div>
    </div>
  );
};

export default Page;
