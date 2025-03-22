"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/utils/store";
import { createDepartment, checkDepartmentExists } from "@/actions/department";
import { getUser } from "@/actions/user";
import { getOrganization } from "@/actions/organization";
import { getOrganizationUsers } from "@/actions/organizationUser";
import SpinningProgress from "@/components/spinning-progress";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Select from "react-select";

// ✅ Define the Schema

const DepartmentForm = () => {
  const createDepartmentSchema = z.object({
    name: z
      .string()
      .nonempty("Department name is required")
      .min(3, "Department name must be at least 3 characters long")
      .superRefine(async (name, ctx) => {
        const resData = await checkDepartmentExists(OrganizationData?.id, name);
        console.log("RES DATA", resData?.department?.id);
        if (resData?.department?.id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Department already exists",
          });
        }
      }),
    description: z.string().optional(),
    users: z.array(z.string().uuid()).optional(),
  });

  const { user } = useUserStore();
  const router = useRouter();
  const userId = user?.userId;
  const [organizationUserSearch, setOrganizationUserSearch] = useState("");
  const organizationUserDebouncedSearch = useDebounce(
    organizationUserSearch,
    1000
  );

  // Fetch organization details
  const {  data: OrganizationData } = useQuery({
    queryKey: ["organization-admin", userId],
    queryFn: async () => {
      const users = await getUser(userId || "");
      return await getOrganization(users?.adminOf?.name || "");
    },
    enabled: !!userId,
  });

  type CreateDepartmentForm = z.infer<typeof createDepartmentSchema>;
  //
  // Fetch organization users
  const { isPending: isOrgUserPending, data: organizationUsersData } = useQuery(
    {
      queryKey: [
        "org-user-list",
        OrganizationData?.name,
        organizationUserDebouncedSearch,
      ],
      queryFn: () =>
        getOrganizationUsers(
          OrganizationData?.name,
          1,
          organizationUserDebouncedSearch
        ),
      enabled: !!OrganizationData?.name,
    }
  );

  // Mutation for creating a department
  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: typeof createDepartmentSchema._type) => {
      return createDepartment(
        OrganizationData?.id,
        data?.name,
        data?.description,
        data?.users
      );
    },
    onSuccess: (res) => {
      try {
        if (res) {
          toast({
            title: "Department Added",
            description: "Department added successfully",
          });
          router.replace("/admin/departments");
        } else {
          toast({
            title: "Error Adding Department",
            description: res?.message || "Something went wrong",
          });
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while adding the department",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: { name: "", description: "", users: [] },
  });

  const onSubmit = async (data: CreateDepartmentForm) => {
    await mutateAsync(data);
  };

  if (!OrganizationData)
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );

  // const check = async(){

  // }
  return (
    <Card className="p-8 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Add Department</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter department name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter description (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select the Users</FormLabel>
                <FormControl>
                  <Select
                    placeholder="Select Users"
                    isMulti
                    onChange={(newValue) =>
                      field.onChange(
                        (newValue as { value: string }[])?.map(
                          (option) => option.value
                        ) || []
                      )
                    }
                    onInputChange={setOrganizationUserSearch}
                    isLoading={isOrgUserPending}
                    options={organizationUsersData?.data?.map(
                      (user: { name: string; id: string }) => ({
                        label: user.name,
                        value: user.id,
                      })
                    )}
                  />
                </FormControl>
                <FormDescription>
                  These are organizational users for the department
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default DepartmentForm;
