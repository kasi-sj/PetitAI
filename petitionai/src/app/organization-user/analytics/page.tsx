'use client'
import UserAnalyticsPortal from '@/components/user-analytics-portal'
// import { DailyPetitionCount } from '@/components/daily-petition-line-chart'
// import { DepartmentRadarChart } from '@/components/department-petition-radar-chart'
// import { PriorityDonutChart } from '@/components/priority-petition-donut-chart'
// import { UserAnalyticsTable } from '@/components/user-analytics-table'
import { useOrganizationUser } from '@/utils/store'
import React from 'react'

const Page = () => {

  const { user } = useOrganizationUser()
  if (user?.id == null) {
    return <></>
  }
  return (
    <div >
      {/* <div className='p-2'>
        <DailyPetitionCount organizationUserId={user.organization.id || ""} />
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <PriorityDonutChart organizationUserId={user.organization.id || ""} />
          <DepartmentRadarChart organizationUserId={user.organization.id || ""} />
        </div>
        <UserAnalyticsTable organizationName={user.organization.name || ""}/>
      </div> */}
      <UserAnalyticsPortal userId={user?.id} />
    </div>
  )
}

export default Page
