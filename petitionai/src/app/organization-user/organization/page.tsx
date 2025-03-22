"use client";
import React from "react";
import OrganizationPage from "@/components/organization-detail-page";
import { useOrganizationUser } from "@/utils/store";

const Page = () => {
  const orgName = useOrganizationUser(
    (state) => state?.user?.organization?.name
  );

  return <OrganizationPage orgName={orgName || ""} />;
};

export default Page;
