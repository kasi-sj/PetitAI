"use client";
import { getOrganization } from "@/actions/organization";
import { getUser } from "@/actions/user";
import UserRoleTable from "@/components/user-role-table";
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
      console.log("INside main page 1", users); // 🔹 Log before setting state
      return await getOrganization(users?.adminOf?.name || "");
    },
    enabled: !!userId, // 🔹 Avoid running query if userId is undefined
  });

  // console.log(isAdmin, "HI ");

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
      <UserRoleTable
        organizationName={OrganizationData?.name}
        type={"AdminUser"}
      />
    </div>
  );
};

export default Page;
