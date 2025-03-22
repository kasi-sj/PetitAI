"use client";
import { getOrganization } from "@/actions/organization";
import { getUser } from "@/actions/user";
//TODO : show all the organization specific routes
//TODO : DO the same for organization-users similar to department
//TODO : normal staff should only have read permission
import OrganizationUserTable from "@/components/organization-user-table";
import { useUserStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
// import Todo from '@/components/todo';
// import { Button } from '@/components/ui/button';
// import Todo from '@/components/todo'
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
    <div className="p-2">
      {/* <Todo message="admin : can edit , add , delete the user details" />
      <Todo message="normal staff : only read permission" /> */}
      <OrganizationUserTable organizationName={OrganizationData?.name || ""} type="Admin" />
    </div>
  );
};

export default Page;
