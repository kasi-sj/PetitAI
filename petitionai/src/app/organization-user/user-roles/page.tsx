'use client'
import UserRoleTable from '@/components/user-role-table';
import { useOrganizationUser } from '@/utils/store';
import React from 'react'


const Page = () => {
  const { user } = useOrganizationUser();
  const organizationName = user?.organization?.name;
  return (
    <div>
      <UserRoleTable organizationName={organizationName || ''} type={"OrganizationUser"}/>
    </div>
  )
}

export default Page
