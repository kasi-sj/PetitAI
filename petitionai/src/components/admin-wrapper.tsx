import React, { ReactNode } from "react";
import NotAuthorized from "./not-authorized"; // Ensure this path is correct

interface AdminWrapperProps {
    children: ReactNode;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
    const isAdmin = true; // Check if user is an admin
    if (!isAdmin) {
        return <NotAuthorized />;
    }

    return <>{children}</>;
};

export default AdminWrapper;
