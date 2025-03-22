import OrganizationUserProfile from "@/components/organization-user-profile";
import React from "react";
type LayoutProps = {
  params: Promise<{ orgUserId: string }>;
};
const Page = async ({ params }: LayoutProps) => {
  const orgUserId = (await params).orgUserId
  return <div>
    <OrganizationUserProfile userId={orgUserId} />
  </div>;
};

export default Page;
