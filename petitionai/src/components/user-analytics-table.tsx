"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserAnalyticsPortal from "./user-analytics-portal";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationUsers } from "@/actions/organizationUser";
import { Input } from "./ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import Image from "next/image";
import SpinningProgress from "./spinning-progress";

type UserType = {
  id: string;
  name: string;
  email: string;
  department: {
    name: string;
  };
  reportTo: {
    name: string;
  };
  role: {
    roleName: string;
  };
  imageURL: string;
  statusCounts: {
    MEDIUM: number;
    HIGH: number;
    LOW: number;
  };
};

// Component for Row Mini Bar Chart
const MiniBarChart = ({
  high,
  medium,
  low,
}: {
  high: number;
  medium: number;
  low: number;
}) => {
  const chartData = [{ name: "", high: high, medium: medium, low: low }];

  return (
    <ResponsiveContainer width={100} height={90}>
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" domain={[0, "dataMax"]} hide />
        <YAxis type="category" dataKey="name" width={40} />
        <Tooltip />
        <Bar dataKey="high" fill="#FF0000" />
        <Bar dataKey="medium" fill="#FFA500" />
        <Bar dataKey="low" fill="#008000" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Main Table Component
export function UserAnalyticsTable({
  organizationName,
}: {
  organizationName: string;
}) {
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [search, setSearch] = React.useState("");
  const {
    isPending,
    error,
    data: organizationUsersData,
  } = useQuery({
    queryKey: ["org-user-list", organizationName, pageNumber, search],
    queryFn: () => getOrganizationUsers(organizationName, pageNumber, search),
  });

  const totalPages = organizationUsersData?.totalPages;
  const currentPage = organizationUsersData?.currentPage;
  const organizationUsers = organizationUsersData?.data || []; // Fallback to sample data

  const [selectedUser, setSelectedUser] = React.useState<null | UserType>(null);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 p-6 flex flex-col text-red-500 text-center py-10">
        Error loading petition details. {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="w-full h-16 flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">User-Level Analytics</h2>
        <div className="mx-2">
          <Input
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearch(event.currentTarget.value);
                setPageNumber(1);
              }
            }}
            placeholder="Filter emails..."
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">S.No</th>
              <th className="p-2">User Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Department</th>
              <th className="p-2">Total</th>
              <th className="p-2">Priority Distribution</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizationUsers.map((user: UserType) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user?.id}</td>
                <td className="p-2">{user?.name}</td>
                <td className="p-2">{user?.email}</td>
                <td className="p-2">{user?.department?.name}</td>
                <td className="p-2">
                  {Object.values(user.statusCounts).reduce(
                    (acc, value) => acc + value,
                    0
                  )}
                </td>
                <td className="p-2">
                  <MiniBarChart
                    high={user.statusCounts?.HIGH}
                    medium={user?.statusCounts?.MEDIUM}
                    low={user?.statusCounts?.LOW}
                  />
                </td>
                <td className="p-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedUser(user)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedUser && (
                      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedUser?.name} Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="p-6 h-full flex flex-col bg-white rounded-lg shadow-md">
                          {/* Scrollable Content */}
                          <div
                            className="overflow-y-auto flex-1 pr-4"
                            style={{ maxHeight: "calc(80vh - 100px)" }}
                          >
                            {selectedUser.imageURL && (
                              <div className="mb-6 flex justify-center">
                                <Image
                                  src={selectedUser.imageURL}
                                  alt={`${selectedUser.name}'s profile`}
                                  width={128}
                                  height={128}
                                  className="w-24 h-24 rounded-full object-cover shadow-lg"
                                />
                              </div>
                            )}
                            <div className="space-y-4 text-gray-700 text-base">
                              <p>
                                <strong>Email:</strong> {selectedUser.email}
                              </p>
                              <p>
                                <strong>Department:</strong>{" "}
                                {selectedUser?.department?.name}
                              </p>
                              <p>
                                <strong>Reports To:</strong>{" "}
                                {selectedUser?.reportTo?.name}
                              </p>
                              <p>
                                <strong>Role Name:</strong>{" "}
                                {selectedUser?.role?.roleName}
                              </p>
                              <p>
                                <strong>Total Petitions:</strong>{" "}
                                {Object.values(
                                  selectedUser.statusCounts
                                ).reduce((acc, value) => acc + value, 0)}
                              </p>
                            </div>
                            <div className="mt-6 w-full">
                              <UserAnalyticsPortal userId={selectedUser.id} />
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem onClick={() => setPageNumber(currentPage - 1)}>
                <PaginationPrevious />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {totalPages && totalPages > currentPage && (
              <PaginationItem onClick={() => setPageNumber(currentPage + 1)}>
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
