'use client'
import DepartmentTable from '@/components/department-table'
import { useOrganizationUser } from '@/utils/store'
import React from 'react'

const Page = () => {
  const {user} = useOrganizationUser()
  const organizationName = user?.organization?.name
    return (
        <div className='p-2'>
            <DepartmentTable organizationName={organizationName} type="OrganizationUser" />
        </div>
    )
}

export default Page
