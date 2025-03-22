"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "@/actions/organization";
import SpinningProgress from "@/components/spinning-progress";
import { useSearchParams } from "next/navigation";
import { getDepartmentById } from "@/actions/department";
import EditDepartmentForm from "@/components/update-department-form";

const Page = () => {
  const searchParams = useSearchParams(); // Get the token from the URL
  const departmentId = searchParams?.get("departmentId");
  const {
    data: department,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: async () => await getDepartmentById(departmentId || ""),
  });

  const { data: organization, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ["organization", department?.organizationId],
    queryFn: async () => await getOrganizationById(department?.organizationId),
    enabled: !!department?.organizationId,
  });

  if (isLoading || isLoadingOrganization || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  return (
    <div className="w-[90%] h-[90%] flex  justify-center items-center">
      <EditDepartmentForm
        department={department}
        organizationName={organization?.name}
        organizationId={department?.organizationId}
      />
    </div>
  );
};

export default Page;
