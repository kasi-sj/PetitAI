"use client";

import { getUserRoleById } from "@/actions/userRole";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import SpinningProgress from "./spinning-progress";

// Define TypeScript types
type Department = {
  name: string;
};

type OrganizationUser = {
  id: string;
  name: string;
  email: string;
  imageURL: string | null;
  isActive: boolean;
  createdAt: string;
  department: Department;
};

type RoleData = {
  id: string;
  roleName: string;
  priority: number;
  createdAt: string;
  organizationUsers: OrganizationUser[];
};

const Role = ({ roleId }: { roleId: string }) => {
  const {
    isPending,
    error,
    data: roleData,
  } = useQuery<RoleData>({
    queryKey: ["role-details", roleId],
    queryFn: async () => await getUserRoleById(roleId),
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  if (error || !roleData) return <ErrorComponent error={error} />;

  // Group users by department
  const usersByDepartment = roleData.organizationUsers.reduce(
    (acc: Record<string, OrganizationUser[]>, user) => {
      const departmentName = user.department?.name || "No Department";
      if (!acc[departmentName]) acc[departmentName] = [];
      acc[departmentName].push(user);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Role Info */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{roleData.roleName}</h1>
        <p className="text-sm text-gray-500">Priority: {roleData.priority}</p>
        <p className="text-sm text-gray-500">
          Created At: {new Date(roleData.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Users List Grouped by Department */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Users in this Role</h2>
        {Object.entries(usersByDepartment).map(([departmentName, users]) => (
          <div key={departmentName} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {departmentName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 border p-3 rounded-lg shadow-sm"
                >
                  <Image
                    src={user.imageURL || "https://via.placeholder.com/50"}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p
                      className={`text-sm font-semibold ${
                        user.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Error Component
const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="max-w-4xl mx-auto p-6 text-red-600">
    <p>Error loading role details:</p>
    <p className="text-sm font-mono mt-2">
      {error?.message || "Unknown error"}
    </p>
    <p className="mt-2">Please try again later.</p>
  </div>
);

export default Role;
