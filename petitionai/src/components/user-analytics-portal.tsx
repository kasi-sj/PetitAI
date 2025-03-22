'use client'
import React from 'react'
import { DailyPetitionCount } from './daily-petition-line-chart'
import { PriorityDonutChart } from './priority-petition-donut-chart'
import OrganizationUserStats from './organization-user-stats'

const UserAnalyticsPortal = ({ userId }: {
    userId: string
}) => {
    return (
        <div className='p-2'>
            <div className="mt-4">
                <DailyPetitionCount userType='OrganizationUser' userId={userId} />
            </div>
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {/* 🍩 Priority Breakdown */}
                <div className="mt-4">
                    <PriorityDonutChart  userType='OrganizationUser' userId={userId} />
                </div>
                <OrganizationUserStats userId={userId} />
            </div>
        </div>
    )
}

export default UserAnalyticsPortal
