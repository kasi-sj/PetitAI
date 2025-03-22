"use client";
import { getOrganizations } from "@/actions/organization";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import SpinningProgress from "./spinning-progress";

const OrganizationList = () => {
  const {
    isPending,
    error,
    data: organizations,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Organizations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isPending && (
          <div className="flex justify-center items-center h-screen">
            <SpinningProgress size={8} />
          </div>
        )}
        {error && <p>Error: {error.message}</p>}
        {organizations &&
          organizations.map(
            (org: {
              _id: string;
              name: string;
              description: string;
              website: string;
            }) => (
              <Link
                key={org._id}
                href={`/organization/${org.name}`}
                className="block"
              >
                <div className="p-4 border rounded-lg shadow hover:bg-gray-100 cursor-pointer">
                  <h3 className="text-lg font-semibold">{org.name}</h3>
                  <p className="text-sm text-gray-600">{org.description}</p>
                  <span className="text-blue-500 text-sm mt-2 inline-block">
                    Visit Website
                  </span>
                </div>
              </Link>
            )
          )}
      </div>
    </div>
  );
};

export default OrganizationList;
