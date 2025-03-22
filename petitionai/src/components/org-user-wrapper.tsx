import React, { ReactNode } from "react";
import NotAuthorized from "./not-authorized"; // Ensure this path is correct

interface OrgUserProps {
    children: ReactNode;
}

const AdminWrapper: React.FC<OrgUserProps> = ({ children }) => {
    const isOrgUser = true; // Check if user is an admin
    if (!isOrgUser) {
        return <NotAuthorized />;
    }

    return <>{children}</>;
};

export default AdminWrapper;
