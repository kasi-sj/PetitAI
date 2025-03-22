import Role from '@/components/role';
import React from 'react'

type Props = {
    params: Promise<{ roleId: string }>;
};
const page = async ({ params }: Props) => {
    const roleId = (await params).roleId
    return (
        <div>
            <Role roleId={roleId} />
        </div>
    )
}

export default page
