"use client";

import { getDepartmentById } from "@/actions/department";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import SpinningProgress from "./spinning-progress";

// Define TypeScript types
type Role = {
  roleName: string;
  priority: number;
};

type User = {
  id: string;
  email: string;
  imageURL: string | null;
  role: Role;
};

type Department = {
  id: string;
  name: string;
  description: string;
  isRoot: boolean;
  createdAt: string;
  _count: {
    users: number;
    petitions: number;
  };
  users: User[];
};

const Department = ({ departmentId }: { departmentId: string }) => {
  const {
    isPending,
    error,
    data: department,
  } = useQuery<Department>({
    queryKey: ["department-view", departmentId],
    queryFn: () => getDepartmentById(departmentId),
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  if (error || !department) return <ErrorComponent error={error} />;

  // Group users by priority level (highest first)
  const usersByPriority: Record<number, User[]> = {};
  department.users.forEach((user) => {
    const priority = user.role.priority;
    if (!usersByPriority[priority]) usersByPriority[priority] = [];
    usersByPriority[priority].push(user);
  });

  // Sort priority levels from highest to lowest
  const sortedPriorities = Object.keys(usersByPriority)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Department Info */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{department.name}</h1>
        <p className="text-gray-600">{department.description}</p>
        <p className="text-sm text-gray-500">
          Root Department:{" "}
          <span className="font-semibold">
            {department.isRoot ? "Yes" : "No"}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          Created At: {new Date(department.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Total Users: {department._count.users} | Petitions:{" "}
          {department._count.petitions}
        </p>
      </div>

      {/* Users List by Priority */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <div className="space-y-6">
          {sortedPriorities.map((priority, index) => (
            <React.Fragment key={priority}>
              {/* Role Title */}
              <h3 className="text-lg font-semibold mb-2">
                {usersByPriority[priority][0].role.roleName}
              </h3>

              {/* Users in this priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usersByPriority[priority].map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 border p-3 rounded-lg shadow-sm"
                  >
                    <Image
                      src={user.imageURL || "https://via.placeholder.com/50"}
                      alt={user.email}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Role:{" "}
                        <span className="font-semibold">
                          {user.role.roleName}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Downward Arrow Between Priority Levels */}
              {index < sortedPriorities.length - 1 && (
                <div className="flex justify-center text-gray-500 text-2xl mt-4">
                  ↓
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};


// Error Component
const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="max-w-4xl mx-auto p-6 text-red-600">
    <p>Error loading department details:</p>
    <p className="text-sm font-mono mt-2">
      {error?.message || "Unknown error"}
    </p>
    <p className="mt-2">Please try refreshing the page or contact support.</p>
  </div>
);

export default Department;
