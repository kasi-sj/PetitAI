import SimilarPetitionList from '@/components/similar-petition-list';
import React from 'react'
type LayoutProps = {
    params: Promise<{ petitionId: string }>;
};
const page = async ({ params }: LayoutProps) => {
    const petitionId = (await params).petitionId;
    return (
        <div className='flex flex-row justify-center items-center h-full'>
            <SimilarPetitionList petitionId={petitionId} />
        </div>
    )
}

export default page
