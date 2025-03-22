"use client";
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUser, updateUser } from "@/actions/user";
import SpinningProgress from "@/components/spinning-progress";
import { useUserStore } from "@/utils/store";
import EditProfileForm from "@/components/update-user-form";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ProfileEditPage = () => {
    const userId = useUserStore((state) => state.user?.userId);
    const router = useRouter();
    const {
        data: user,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => await getUser(userId || ""),
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: async (data: {
            name: string,
            email: string,
            dob?: string,
            gender?: string,
            profilePic?: string,
            address?: string,
            phoneNo?: string,
            bio?: string,
            isActive?: boolean,
        }) => {
            // Add your update logic here, for example:
            return await updateUser(userId || "", data);
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Profile updated successfully.",
                duration: 5000,
            })
            router.back();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Error updating profile.",
                duration: 5000,
            })
        }
    });

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SpinningProgress size={8} />
            </div>
        );
    }

    return (
        <div className="w-[90%] h-[90%] mt-10 flex justify-center items-center">
            <EditProfileForm user={user} onSubmit={mutation.mutate} />
        </div>
    );
};

export default ProfileEditPage;
