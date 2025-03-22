"use client";
import { getOrganization } from "@/actions/organization";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Counter from "./ui/animata/counter";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import SpinningProgress from "./spinning-progress";

const displayField = (value: string | number | null | undefined) => {
  return value ? value : "Not entered";
};

const OrganizationPage = ({
  orgName,
  isAdmin,
}: {
  orgName: string;
  isAdmin?: boolean;
}) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["org-detail", orgName],
    queryFn: async () => await getOrganization(orgName || ""),
  });
  const router = useRouter();
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500 text-center py-10">
        Error loading organization details.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        {isAdmin && (
          <Button
            className="absolute top-4 right-4"
            onClick={() => router.push("/admin/organization/edit")}
          >
            Edit
          </Button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Organization Information */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Organization Name
              </label>
              <div className="flex gap-2 mt-2">
                <Image
                  src={data?.imageURL}
                  alt="orgLogo"
                  height={12}
                  width={32}
                />
                <h1 className="text-3xl font-bold mt-1">
                  {displayField(data?.name)}
                </h1>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Email Address
              </label>
              <p className="text-gray-600 mt-1">{displayField(data?.email)}</p>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <span
                  className={`block mt-1 px-3 py-1 rounded-full text-sm ${
                    data?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {data?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Established Year
                </label>
                <span className="block mt-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {displayField(data?.establishedYear)}
                </span>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Organization ID
              </label>
              <p className="text-sm font-mono text-gray-600 break-all mt-1">
                {data?.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Rejection Similarity Threshold
              </label>
              <p className="mt-1">{data?.similarityThreshold}%</p>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Organization Overview
          </h2>
          <div className="flex gap-6">
            <div className="p-4 bg-gray-50 rounded-lg w-40">
              <label className="text-sm text-gray-600">Total Petitions</label>
              <p className="text-2xl font-bold mt-2">
                <Counter targetValue={data?._count?.petitions || 0} />
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg w-40">
              <label className="text-sm text-gray-600">Total Departments</label>
              <p className="text-2xl font-bold mt-2">
                <Counter targetValue={data?._count?.departments || 0} />
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg w-40">
              <label className="text-sm text-gray-600">Total Users</label>
              <p className="text-2xl font-bold mt-2">
                <Counter targetValue={data?._count?.users || 0} />
              </p>
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="text-gray-600 mt-1 whitespace-pre-line">
              {displayField(data?.description)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Website</label>
            <p className="text-gray-600 mt-1">{displayField(data?.website)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <p className="text-gray-600 mt-1">
              {displayField(data?.phoneNumber)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="text-gray-600 mt-1">{displayField(data?.address)}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created At
              </label>
              <p className="text-gray-600 mt-1">
                {displayField(data?.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Updated At
              </label>
              <p className="text-gray-600 mt-1">
                {displayField(data?.updatedAt)}
              </p>
            </div>
            <div></div>
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium my-3 text-gray-700">
              Whitelisted Emails
            </label>
            <div className="mt-2 space-y-2">
              {data?.whitelistedEmails?.map(
                (data: { id: string; email: string }) => (
                  <div
                    key={data?.id}
                    className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-gray-50"
                  >
                    <p className="text-gray-700 font-medium">
                      {displayField(data?.email)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrganizationPage;
