"use client";

import { getPetitionsById } from "@/actions/petition";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";
import { petitionStatusUpdate } from "@/actions/statusUpdate";
import { useOrganizationUser } from "@/utils/store";
import { getOrganizationUser } from "@/actions/organizationUser";
import DelegateModal from "./ui/delegate-modal";
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

type Department = {
  id: string;
  name: string;
  description: string;
};

type Petition = {
  id: string;
  subject: string;
  body: string;
  tag: string;
  priority: PriorityEnum;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  department?: Department | null;
  organizationUserAssignments: {
    organizationUser: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  statusUpdates: {
    id: string;
    status: StatusEnum;
    description: string;
    createdAt: string;
  }[];
};

// Priority Colors
const priorityColors: Record<PriorityEnum, string> = {
  LOW: "bg-green-100 text-green-600",
  MEDIUM: "bg-orange-100 text-orange-600",
  HIGH: "bg-red-100 text-red-600",
};

// Tag Color
const tagColor = "bg-blue-100 text-blue-600";

// Status Colors
const statusColors: Record<StatusEnum, string> = {
  ERROR: "text-red-600",
  SUBMITTED: "text-gray-600",
  QUEUED: "text-yellow-600",
  CATEGORIZING: "text-purple-600",
  CATEGORY_ASSIGNED: "text-indigo-600",
  ASSIGNED: "text-blue-600",
  DELEGATED: "text-teal-600",
  FORWARDED: "text-cyan-600",
  PROCESSING: "text-orange-600",
  REPEATED_REJECTION: "text-pink-600",
  REJECTED: "text-red-700",
  PROCESSED: "text-green-600",
};

const description: Record<StatusEnum, string> = {
  FORWARDED: "Your petition has been forwarded to the relevant department",
  REJECTED: "Your petition has been rejected.",
  PROCESSED: "Your petition has been processed successfully.",
  DELEGATED: "Your petition has been delegated to another user.",
  ERROR: "",
  SUBMITTED: "",
  QUEUED: "",
  CATEGORIZING: "",
  CATEGORY_ASSIGNED: "",
  ASSIGNED: "",
  PROCESSING: "",
  REPEATED_REJECTION: "",
};

const PetitionDetails = ({
  petitionId,
  type = "OrganizationUser",
}: {
  petitionId: string;
  type?: "OrganizationUser" | "Admin" | "Similar";
}) => {
  const { id, department } = useOrganizationUser((state) => state.user);
  const { data: organizationUserData, isPending: organizationUserPending } =
    useQuery({
      queryKey: ["organization-user", id],
      queryFn: async () => await getOrganizationUser(id || ""),
    });

  // console.log("organizationUserData", organizationUserData);

  const {
    isPending,
    error,
    refetch,
    data: petitionData,
  } = useQuery({
    queryKey: ["petition-details", petitionId],
    queryFn: async () => await getPetitionsById(petitionId),
  });

  const mutation = useMutation({
    mutationFn: async (status: StatusEnum) => {
      await petitionStatusUpdate(
        petitionId,
        status,
        description[status],
        organizationUserData?.reportToId
      );
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (isPending || mutation.isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error || !petitionData) {
    return (
      <div className="w-full h-full bg-gray-100 p-6  flex flex-col text-red-500 text-center py-10">
        Error loading petition details.
      </div>
    );
  }

  const isAssignedUser = petitionData?.organizationUserAssignments?.some(
    (assignment: { organizationUser: { id: string } }) =>
      assignment.organizationUser.id === id
  );

  const petition: Petition = petitionData;
  const sortedStatusUpdates = [...petition.statusUpdates]?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestStatus = sortedStatusUpdates[0];
  const latestStatusId = sortedStatusUpdates[0]?.id;
  // Sort status updates by latest createdAt time (Descending Order)
  // const mutation = useMutation({
  //     mutationFn: async (status: string, delegateTo?: string) => {
  //         // await updatePetitionStatus(petitionId, status, delegateTo);
  //     },
  //     onSuccess: () => {
  //         refetch();
  //     },
  // });

  const statusUpdate = async (status: StatusEnum) => {
    await mutation.mutateAsync(status);
  };

  console.log("type ", type);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl  bg-white shadow-md rounded-lg p-6">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800">
          {petition.subject}
        </h2>

        {/* Petition Body */}
        <p className="text-gray-700 mt-4 text-lg">{petition.body}</p>

        {type == "OrganizationUser" &&
          isAssignedUser &&
          latestStatus.status !== "PROCESSED" &&
          latestStatus.status !== "REJECTED" && (
            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                onClick={() => {
                  statusUpdate("PROCESSED");
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark As Done
              </Button>
              <Button
                onClick={() => {
                  statusUpdate("REJECTED");
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  statusUpdate("FORWARDED");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
                disabled={organizationUserData?.reportToId ? false : true}
              >
                {organizationUserPending ? (
                  <SpinningProgress size={8} />
                ) : (
                  "Escalate"
                )}
              </Button>
              {/* <Button
              onClick={() => {
                // statusUpdate("DELEGATED");
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Delegate
            </Button>
             */}
              <DelegateModal
                departmentId={department?.id || ""}
                petitionId={petitionId}
                refetch={refetch}
              />
              {/* <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Delegate to (User ID)"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <Button onClick={() => handleAction('DELEGATED', selectedUser)} className="bg-yellow-600 hover:bg-yellow-700 text-white">Delegate</Button>
                    </div> */}
            </div>
          )}

        {/* Meta Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(petition.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(petition.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Department (if available) */}
        {petition.department && (
          <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
            <p className="text-lg font-semibold text-blue-600">
              {petition.department.name}
            </p>
            <p className="text-sm text-gray-700">
              {petition.department.description}
            </p>
          </div>
        )}

        {/* Tags & Priority */}
        <div className="mt-4 flex flex-wrap gap-3">
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              priorityColors[petition.priority]
            }`}
          >
            {petition.priority}
          </span>
          <span className={`px-3 py-1 rounded text-sm font-medium ${tagColor}`}>
            {petition.tag}
          </span>
          {latestStatus && (
            <span
              className={`px-3 py-1 rounded text-sm font-medium border border-gray-300 ${
                statusColors[latestStatus.status]
              }`}
            >
              {latestStatus.status}
            </span>
          )}
        </div>

        {/* Status Updates */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Status Updates
          </h3>

          <div className="mt-3 space-y-3">
            {sortedStatusUpdates.map((update) => (
              <div
                key={update.id}
                className="p-4 rounded-md shadow-sm border bg-gray-100 border-gray-200 flex items-center gap-2"
              >
                <div>
                  <div className="flex flex-row  gap-2 ">
                    <p
                      className={`text-sm font-medium ${
                        statusColors[update.status]
                      }`}
                    >
                      {update.status}
                    </p>
                    {update.id === latestStatusId && (
                      <span className="w-2.5 h-2.5 mt-1 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs">{update.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(update.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments (if any) */}
        {petition.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Attachments</h3>
            <ul className="mt-2 space-y-2">
              {petition.attachments.map((attachment, index) => (
                <li
                  key={index}
                  className="text-blue-600 text-sm underline cursor-pointer"
                >
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Attachment {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetitionDetails;
