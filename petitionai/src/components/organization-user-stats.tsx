"use client";
import { getOrganizationUser } from "@/actions/organizationUser";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SpinningProgress from "./spinning-progress";

const OrganizationUserStats = ({ userId }: { userId: string }) => {
  const {
    data: organizationUserData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["organization-user", userId],
    queryFn: async () => await getOrganizationUser(userId || ""),
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
        Error loading petition details. {error.message}
      </div>
    );
  }

  console.log(organizationUserData.statusCount);
  const assigned = organizationUserData?.statusCount?.ASSIGNED || 0;
  const forwarded = organizationUserData?.statusCount?.FORWARDED || 0;
  const delegated = organizationUserData?.statusCount?.DELEGATED || 0;
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          📌 Assigned: {assigned}
        </div>
        {/* the below can be wrong just for filling the page */}
        <div className="bg-gray-100 p-3 rounded-lg">
          🔄 Forwarded: {forwarded}
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          🔁 Delegated: {delegated}
        </div>
      </div>
    </div>
  );
};

export default OrganizationUserStats;
