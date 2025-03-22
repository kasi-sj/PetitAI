// TODO: shows all the department specific details
// TODO: can able to edit some of the details
// TODO: add loading.tsx , Error.tsx to efficiently handle the error and loading case
// TODO: show all the OrganizationUsers in the department
// TODO: for normal staff only read permission should be there

import Department from '@/components/department';
// import Todo from '@/components/todo';
import React from 'react'

type LayoutProps = {
  params: Promise<{ departmentId: string }>;
};

const page = async ({params} : LayoutProps) => {
  const { departmentId} = await params;
  return (
    <div>
      {/* <Todo message={`Need to show details specific to ${departmentId}`}/>
      <Todo message={`admin : Can able to edit the department specific details`} />
      <Todo message={`Need to show who are the users with in this department`} />
      <Todo message={`Need to have an option to add users in this department`} />
      <Todo message={`If possible can show the department hierarchy`} />
      <Todo message={`Can specify how many petitions processed , etc..`} />
      <Todo message={`OrgUser : can able to click only their department , disable other department`} /> */}
      <Department departmentId={departmentId} />
    </div>
  )
}

export default page
