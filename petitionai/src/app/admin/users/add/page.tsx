"use client";
import React from "react";
import AddOrganizationUserForm from "@/components/add-organization-user-form";
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
    data: OrganizationData,
  } = useQuery({
    queryKey: ["organization-admin", userId],
    queryFn: async () => {
      const users = await getUser(userId || "");
      console.log("INside main page 1", users); // 🔹 Log before setting state
      return await getOrganization(users?.adminOf?.name || "");
    },
    // enabled: !!userId, // 🔹 Avoid running query if userId is undefined
  });
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <SpinningProgress size={8} />
      </div>
    );
  }
  console.log("organization", OrganizationData);
  return (
    <div>
      <AddOrganizationUserForm organizationName={OrganizationData?.name} />
    </div>
  );
};

export default Page;
