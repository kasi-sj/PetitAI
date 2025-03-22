"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/utils/store";
import { getUser } from "@/actions/user";
import { getOrganization } from "@/actions/organization";
import CreateRoleForm from "@/components/add-role-form";
import SpinningProgress from "@/components/spinning-progress";

const Page = () => {
  const { user } = useUserStore();
  const userId = user?.userId;

  const { isPending, data: OrganizationData } = useQuery({
    queryKey: ["organization-admin", userId],
    queryFn: async () => {
      if (!userId) return null;
      const users = await getUser(userId);
      return await getOrganization(users?.adminOf?.name || "");
    },
    enabled: !!userId,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (!OrganizationData?.id) {
    return <div>No organization found</div>;
  }

  return (
    <div className="p-6 mt-20 flex justify-center">
      <Card className="p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Add Role</h2>
        <CreateRoleForm organizationId={OrganizationData.id} />
      </Card>
    </div>
  );
};

export default Page;
