
import UserPetitionTable from '@/components/user-petitions-table';
import React from 'react'
type LayoutProps = {
  params: Promise<{ organizationNameOrPetitionId: string }>;
};

const page = async ({ params }: LayoutProps) => {
  
  // const user = await getUser(userId)
  const organizationName  = (await params).organizationNameOrPetitionId;
  return (
    <div>
      <UserPetitionTable organization={organizationName}/>
    </div>
  )
}

export default page
