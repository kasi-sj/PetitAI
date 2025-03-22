"use client";
import { getMostSimilarPetitions } from "@/actions/petition";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import SpinningProgress from "./spinning-progress";

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

type SimilarPetitions = {
  id: string;
  subject: string;
  body: string;
  priority: PriorityEnum;
  tag: string;
  createdAt: string;
  updatedAt: string;
  organizationUserAssignments: {
    organizationUser: {
      name: string;
      email: string;
    };
  }[];
  department?: {
    name: string;
  } | null;
  statusUpdates: {
    id: string;
    status: StatusEnum;
    description: string;
    createdAt: string;
  }[];
  similarity: number;
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

const SimilarPetitionList = ({ petitionId }: { petitionId: string }) => {
  const {
    isPending,
    error,
    data: similarPetitions,
  } = useQuery({
    queryKey: ["org-user-petitions-similar-petition", petitionId],
    queryFn: async () => await getMostSimilarPetitions(petitionId),
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
      <div className="w-full h-full bg-gray-100 p-6  flex flex-col text-red-500 text-center py-10">
        Error loading petitions.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 p-6  flex flex-col ">
      <h2 className="text-3xl font-semibold text-gray-800 my-3">
        Most Similar Petitions
      </h2>
      <div className="space-y-3">
        {similarPetitions.length > 0 ? (
          similarPetitions.map((petition: SimilarPetitions) => {
            const sortedStatusUpdates = [...petition.statusUpdates].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            const latestStatus = sortedStatusUpdates[0];
            const similarity = petition.similarity;
            const userAssignmentName =
              petition.organizationUserAssignments.length > 0
                ? petition.organizationUserAssignments[0].organizationUser.name
                : "Not Assigned Yet";
            const userAssignmentEmail =
              petition.organizationUserAssignments.length > 0
                ? petition.organizationUserAssignments[0].organizationUser.email
                : "Not Assigned Yet";
            return (
              <div
                key={petition.id}
                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition"
              >
                <Link
                  href={`/organization-user/petitions/${petitionId}/similar/${petition.id}/`}
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
                    <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                      {Math.round(similarity * 100)}% Similar
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
                        <p>
                          <span className="text-gray-500">by</span>{" "}
                          <span className="font-semibold">
                            {userAssignmentName}
                          </span>{" "}
                          <span className="text-gray-500">
                            ({userAssignmentEmail})
                          </span>
                        </p>
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
    </div>
  );
};

export default SimilarPetitionList;
