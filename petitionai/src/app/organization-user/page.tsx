"use client";

import OrganizationUserProfile from "@/components/organization-user-profile";
import { useOrganizationUser } from "@/utils/store";

const ProfilePage = () => {
  const { user } = useOrganizationUser();
  const userId = user.id;
  return <OrganizationUserProfile userId={userId || ""} />;
};

export default ProfilePage;
