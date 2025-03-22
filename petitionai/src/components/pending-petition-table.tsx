"use client";

import React, { useState } from "react";
import {
  getAdminUserPetitions,
  getOrganizationUserPetitions,
} from "@/actions/organizationUser";
import { useOrganizationUser, useUserStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpinningProgress from "./spinning-progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

type PriorityEnum = "LOW" | "MEDIUM" | "HIGH";
type StatusEnum =
  | "ERROR"
  | "SUBMITTED"
  | "QUEUED"
  | "CATEGORIZING"
  | "CATEGORY_ASSIGNED"
  | "ASSIGNED"
  | "DELEGATED"
  | "FORWARDED"
  | "PROCESSING"
  | "REPEATED_REJECTION"
  | "REJECTED"
  | "PROCESSED";

type PetitionAssignment = {
  id: string;
  petition: {
    id: string;
    subject: string;
    body: string;
    priority: PriorityEnum;
    tag: string;
    createdAt: string;
    updatedAt: string;
    department?: {
      name: string;
    } | null;
    statusUpdates: {
      id: string;
      status: StatusEnum;
      description: string;
      createdAt: string;
    }[];
  };
};

// Priority Colors
const priorityColors: Record<PriorityEnum, string> = {
  LOW: "bg-green-100 text-green-600",
  MEDIUM: "bg-orange-100 text-orange-600",
  HIGH: "bg-red-100 text-red-600",
};

// Tag Color (Unified Blue)
const tagColor = "bg-blue-100 text-blue-600";

// Status Colors
const statusColors: Record<StatusEnum, string> = {
  ERROR: "bg-red-100 text-red-600",
  SUBMITTED: "bg-gray-100 text-gray-600",
  QUEUED: "bg-yellow-100 text-yellow-600",
  CATEGORIZING: "bg-purple-100 text-purple-600",
  CATEGORY_ASSIGNED: "bg-indigo-100 text-indigo-600",
  ASSIGNED: "bg-blue-100 text-blue-600",
  DELEGATED: "bg-teal-100 text-teal-600",
  FORWARDED: "bg-cyan-100 text-cyan-600",
  PROCESSING: "bg-orange-100 text-orange-600",
  REPEATED_REJECTION: "bg-pink-100 text-pink-600",
  REJECTED: "bg-red-200 text-red-700",
  PROCESSED: "bg-green-100 text-green-600",
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, text.lastIndexOf(" ", maxLength)) + "...";
};

const AllPetitionTable = ({ isAdmin }: { isAdmin?: true }) => {
  const { user } = useOrganizationUser();
  const { user: adminUser } = useUserStore();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const userId = user?.id;

  const { isPending, error, isFetching, data, refetch } = useQuery({
    queryKey: [
      "org-user-petitions-pending",
      adminUser?.userId,
      userId,
      pageNumber,
    ],
    queryFn: () => {
      if (isAdmin && adminUser?.userId) {
        return getAdminUserPetitions(
          adminUser?.userId || "",
          false,
          pageNumber
        );
      }
      return getOrganizationUserPetitions(userId || "", true, pageNumber);
    },
    enabled: !!(userId || adminUser?.userId), // Ensures the query only runs if userId is available
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
      <div className="text-red-500 text-center py-10">
        Error loading petitions.
      </div>
    );
  }

  const petitionsAssignments = data?.petitionsAssignments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">All Pending Petitions</h2>
        <Button onClick={() => refetch()} variant="outline">
          {isFetching ? (
            <SpinningProgress size={8} />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}{" "}
          Refetch
        </Button>
      </div>

      <div className="space-y-3">
        {petitionsAssignments.length > 0 ? (
          petitionsAssignments.map((assignment: PetitionAssignment) => {
            const { petition } = assignment;
            const sortedStatusUpdates = [...petition.statusUpdates].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            const latestStatus = sortedStatusUpdates[0];

            return (
              <div
                key={petition.id}
                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition"
              >
                <Link
                  href={`/${
                    isAdmin ? "admin" : "organization-user"
                  }/petitions/${petition.id}/`}
                  passHref
                >
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">
                      {truncateText(petition.subject, 50)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(petition.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 text-sm">
                    {truncateText(petition.body, 100)}
                  </p>

                  {/* Priority, Tag, and Status with Red Dot for Latest */}
                  <div className="mt-2 flex items-center space-x-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        priorityColors[petition.priority]
                      }`}
                    >
                      {petition.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${tagColor}`}>
                      {petition.department
                        ? petition.department.name
                        : "Not Assigned Yet"}
                    </span>
                    {latestStatus && (
                      <span className="flex items-center space-x-1">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            statusColors[latestStatus.status]
                          }`}
                        >
                          {latestStatus.status}
                        </span>
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600 text-sm">
            No petitions found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {pageNumber !== 1 && (
                <PaginationPrevious
                  onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                />
              )}
            </PaginationItem>
            <span className="text-sm font-medium px-3">
              {pageNumber} / {totalPages}
            </span>
            <PaginationItem>
              {pageNumber < totalPages && (
                <PaginationNext
                  onClick={() =>
                    setPageNumber((prev) => Math.min(totalPages, prev + 1))
                  }
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default AllPetitionTable;
