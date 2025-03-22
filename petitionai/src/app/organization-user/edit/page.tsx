"use client";
import { getOrganizationUser } from "@/actions/organizationUser";
import SpinningProgress from "@/components/spinning-progress";
import EditOrganizationUserForm from "@/components/update-organization-user-form";
import { useOrganizationUser } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Department {
  name: string;
  description: string;
  isRoot: boolean;
}

interface Role {
  id: string;
  roleName: string;
  priority: number;
}

interface ReportToUser {
  id: string;
  name: string;
  imageURL: string;
  isActive: boolean;
  department: Department;
}

interface Subordinate {
  id: string;
  name: string;
  imageURL: string;
  isActive: boolean;
  department: Department;
}

interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  imageURL: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department: Department;

  role: Role;
  reportTo: ReportToUser | null;
  subordinates: Subordinate[];
  departmentId: string;

  organization: {
    name: string;
  };
  _count: {
    petitionAssignments: number;
  };
}

const Page = () => {
  const { user } = useOrganizationUser();
  const userId = user.id;
  const { isPending, error, data } = useQuery<OrganizationUser>({
    queryKey: ["org-user", userId],
    queryFn: async () => await getOrganizationUser(userId || ""),
    enabled: !!userId,
  });
  if (!userId) return null;
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500 text-center py-10">
        Error loading profile.
      </div>
    );
  }

  return (
    <div>
      <EditOrganizationUserForm
        organizationName={data?.organization?.name || ""}
        user={{
          departmentId: data.departmentId,
          email: data.email,
          id: data.id,
          isActive: data.isActive,
          name: data.name,
          organization: data.organization.name,
          role: data.role,
          reportTo: data.reportTo ? { id: data.reportTo.id } : undefined,
        }}
        isOrganizationUser={true}
      />
    </div>
  );
};

export default Page;
