import Petition from "@/components/petition";
import React from "react";
type LayoutProps = {
  params: Promise<{ organizationNameOrPetitionId: string }>;
};

const page = async ({ params }: LayoutProps) => {
  // const userId = "e3aca84a-b910-45ee-999e-393e5d09c4d6" // hardCoded for now , need to change with JWT
  // const user = await getUser(userId)
  const petitionId = (await params).organizationNameOrPetitionId;

  return (
    <div>
      <Petition petitionId={petitionId} />
    </div>
  );
};

export default page;
