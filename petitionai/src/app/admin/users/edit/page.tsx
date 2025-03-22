"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "@/actions/organization";
import SpinningProgress from "@/components/spinning-progress";
import EditOrganizationUserForm from "@/components/update-organization-user-form";
import { useSearchParams } from "next/navigation";
import { getOrganizationUser } from "@/actions/organizationUser";

const Page = () => {
  const searchParams = useSearchParams(); // Get the token from the URL
  const userId = searchParams?.get("userId");
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["organizationUser", userId],
    queryFn: async () => await getOrganizationUser(userId || ""),
  });

  const { data: organization, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ["organization", user?.organizationId],
    queryFn: async () => await getOrganizationById(user?.organizationId),
    enabled: !!user?.organizationId,
  });

  if (isLoading || isLoadingOrganization || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  return (
    <div>
      <EditOrganizationUserForm
        user={user}
        organizationName={organization?.name}
      />
    </div>
  );
};

export default Page;
