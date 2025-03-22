'use client'
import { getOrganizationUser } from '@/actions/organizationUser'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import SpinningProgress from "./spinning-progress";

// Helper function to display field values
const displayField = (value: string | null | undefined) => {
  return value?.trim() ? value : "Not entered";
};

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
  _count: {
    petitionAssignments: number;
  };
}

const OrganizationUserProfile = ({userId}:{userId:string}) => {
  const router = useRouter()

  const { isPending, error, data } = useQuery<OrganizationUser>({
    queryKey: ["org-user", userId],
    queryFn: async () => await getOrganizationUser(userId),
  });

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
        Error loading profile.
      </div>
    );
  }

  const {
    name,
    email,
    imageURL,
    department,
    role,
    reportTo,
    subordinates,
    isActive,
    createdAt,
    _count,
  } = data;
  const petitionAssignments = _count.petitionAssignments;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Button
          className="absolute top-4 right-4"
          onClick={() => router.push("/organization-user/edit")}
        >
          Edit
        </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Image
                src={imageURL}
                alt={name}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg object-cover w-32 h-32"
              />
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <h1 className="text-3xl font-bold text-gray-900 mt-1">
                    {displayField(name)}
                  </h1>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-600 mt-1">
                    {displayField(email)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Account Status
                    </label>
                    <span
                      className={`block mt-1 px-3 py-1 rounded-full text-sm ${
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Role
                    </label>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm block mt-1">
                      {displayField(role?.roleName)} (Priority:{" "}
                      {role?.priority || "N/A"})
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-sm block mt-1">
                      {displayField(department?.name)}{" "}
                      {department?.isRoot && "(Root)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reporting Structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTo && (
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  REPORTING STRUCTURE
                </h3>
                <div className="flex items-center gap-4">
                  <Image
                    src={reportTo.imageURL}
                    alt={reportTo.name}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Manager Name
                    </label>
                    <p className="font-medium text-gray-900 mt-1">
                      {displayField(reportTo.name)}
                    </p>

                    <label className="text-sm font-medium text-gray-500 mt-2 block">
                      Manager&apos;s Department
                    </label>
                    <p className="text-sm text-gray-500">
                      {displayField(reportTo.department?.name)}
                    </p>

                    <div className="mt-2 space-y-1">
                      <label className="text-xs font-medium text-gray-500">
                        Department Type
                      </label>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md block">
                        {reportTo.department?.isRoot
                          ? "Head Department"
                          : "Sub Department"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subordinates */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    TEAM MEMBERS
                  </h3>
                  <label className="text-xs text-gray-400">
                    Direct reports
                  </label>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">
                  {subordinates.length}{" "}
                  {subordinates.length === 1 ? "member" : "members"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subordinates.map((subordinate) => (
                  <div
                    key={subordinate.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Image
                      src={subordinate.imageURL || "/placeholder-avatar.png"}
                      alt={subordinate.name}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Member Name
                      </label>
                      <p className="text-sm font-medium text-gray-900">
                        {displayField(subordinate.name)}
                      </p>

                      <label className="text-xs font-medium text-gray-500 mt-1 block">
                        Department
                      </label>
                      <p className="text-xs text-gray-500">
                        {displayField(subordinate.department?.name)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Department Details */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-fit lg:sticky lg:top-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ORGANIZATION DETAILS
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-500 block mb-1">
                Department Name
              </label>
              <p className="text-gray-900 font-medium">
                {displayField(department?.name)}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 block mb-1">
                Department Type
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                {department?.isRoot ? "Main Branch" : "Child Branch"}
              </span>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 block mb-1">
                Department Description
              </label>
              <p className="text-gray-700 text-sm leading-relaxed">
                {displayField(department?.description)}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                EMPLOYMENT DETAILS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <label className="text-gray-500">Member Since</label>
                  <span className="text-gray-900">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500">Petitions Assigned</label>
                  <span className="text-gray-900">
                    {petitionAssignments || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500">Last Updated</label>
                  <span className="text-gray-900">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationUserProfile;
