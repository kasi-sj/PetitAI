"use client";
import React from "react";
import OrganizationPage from "@/components/organization-detail-page";
import { useUserStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { getOrganization } from "@/actions/organization";
import { getUser } from "@/actions/user";
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
    return <div>Error loading organization.</div>;
  }

  return (
    <OrganizationPage orgName={OrganizationData?.name || ""} isAdmin={true} />
  );
};

export default Page;
