"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Switch } from "./ui/switch";

const UpdateUserSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email format"),
    dob: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    profilePic: z.string().optional(),
    address: z.string().optional(),
    phoneNo: z.string().optional(),
    bio: z.string().optional(),
    isActive: z.boolean().optional(),
});


const EditProfileForm = ({
    user,
    onSubmit,
}: {
    user: z.infer<typeof UpdateUserSchema>;
    onSubmit: (data: z.infer<typeof UpdateUserSchema>) => void;
}) => {
    const form = useForm({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
            gender: user.gender || "OTHER",
            profilePic: user.profilePic || "",
            address: user.address || "",
            phoneNo: user.phoneNo || "",
            bio: user.bio || "",
            isActive: user.isActive || false,
        },
    });

    const handleSubmit = async (data: z.infer<typeof UpdateUserSchema>) => {
        try {
            onSubmit(data);
        } catch {
            toast({
                title: "Error",
                description: "Error updating profile.",
                duration: 5000,
            })
        }
    };

    return (
        <Card className="p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded-md">
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a short bio" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                                <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Update Profile
                    </Button>
                </form>
            </Form>
        </Card>
    );
};

export default EditProfileForm;
