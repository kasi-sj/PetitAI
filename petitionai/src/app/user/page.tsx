"use client";
import { getUser } from "@/actions/user";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useUserStore } from "@/utils/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SpinningProgress from "@/components/spinning-progress";

// Helper function to display field values
const displayField = (value: string | null | undefined) => {
  return value?.trim() ? value : "Not entered";
};

const Page = () => {
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.userId);
  const { isPending, error, data } = useQuery({
    queryKey: ["org-user", userId],
    queryFn: async () => await getUser(userId || ""),
  });

  if (isPending) {
    <div className="flex justify-center items-center h-screen">
      <SpinningProgress size={8} />
    </div>;
  }

  if (error || !data) {
    return (
      <div className="text-red-500 text-center py-10">
        Error loading profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
      <Button
          className="absolute top-4 right-4"
          onClick={() => router.push("/user/edit")}
        >
          Edit
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <h1 className="text-3xl font-bold mt-1">
                {displayField(data.name)}
              </h1>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Email Address
              </label>
              <p className="text-gray-600 mt-1">{displayField(data.email)}</p>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <span
                  className={`block mt-1 px-3 py-1 rounded-full text-sm ${
                    data.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {data.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Gender
                </label>
                <span className="block mt-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {displayField(data.gender)?.toLowerCase() || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Member Since
              </label>
              <p className="mt-1">
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="text-sm font-mono text-gray-600 break-all mt-1">
                {data.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="mt-1">
                {new Date(data.updatedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Overview
          </h2>
          <div className="flex gap-6">
            <div className="p-4 bg-gray-50 rounded-lg w-40">
              <label className="text-sm text-gray-600">Total Petitions</label>
              <p className="text-2xl font-bold mt-2">
                {data._count.petitions || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Bio</label>
            <p className="text-gray-600 mt-1 whitespace-pre-line">
              {displayField(data.bio)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="text-gray-600 mt-1">{displayField(data.address)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <p className="text-gray-600 mt-1">{displayField(data.phoneNo)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Date of Birth
            </label>
            <p className="text-gray-600 mt-1">
              {data.dob
                ? new Date(data.dob).toLocaleDateString()
                : "Not entered"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Page;
