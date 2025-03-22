import React, { ReactNode } from "react";
import NotAuthorized from "./not-authorized"; // Ensure this path is correct

interface NormalUserWrapperProps {
    children: ReactNode;
}

const NormalUserWrapper: React.FC<NormalUserWrapperProps> = ({ children }) => {
    const isNormalUser = true; // Check if user is an NormalUser
    if (!isNormalUser) {
        return <NotAuthorized />;
    }

    return <>{children}</>;
};

export default NormalUserWrapper;
