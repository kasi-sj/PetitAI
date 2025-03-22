import PetitionDetails from '@/components/petition';
import React from 'react'
type LayoutProps = {
    params: Promise<{ similarId: string }>;
};


const page = async ({ params }: LayoutProps) => {
    const petitionId = (await params).similarId;
    return (
        <div>
            <PetitionDetails petitionId={petitionId} type="Similar" />
        </div>
    )
}

export default page
