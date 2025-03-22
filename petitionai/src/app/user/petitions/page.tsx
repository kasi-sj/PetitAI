import UserPetitionTable from "@/components/user-petitions-table";
import React from "react";

const page = () => {
  // const user = await getUser(userId)
  return (
    <div>
      <UserPetitionTable organization={null} />
    </div>
  );
};

export default page;
