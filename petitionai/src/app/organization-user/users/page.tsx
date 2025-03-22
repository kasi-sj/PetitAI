'use client'
//TODO : show all the organization specific routes
//TODO : DO the same for organization-users similar to department
//TODO : normal staff should only have read permission
import OrganizationUserTable from '@/components/organization-user-table'
import { useOrganizationUser } from '@/utils/store';
// import Todo from '@/components/todo';
// import { Button } from '@/components/ui/button';
// import Todo from '@/components/todo'
import React from 'react'



const Page =  () => {
  const {user} = useOrganizationUser()
  const organizationName = user.organization.name
  return (
    <div className='p-2'>
      {/* <Todo message="admin : can edit , add , delete the user details" />
      <Todo message="normal staff : only read permission" /> */}
      <OrganizationUserTable organizationName={organizationName || ""} type="OrganizationUser" />
    </div>
  )
}

export default Page
