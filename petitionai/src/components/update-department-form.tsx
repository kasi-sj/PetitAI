"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkDepartmentExists,
  updateDepartment,
} from "@/actions/department";
import { getOrganizationUsers } from "@/actions/organizationUser";
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

const EditDepartmentForm = ({
  department,
  organizationName,
  organizationId,
}: {
  department: {
    id: string;
    name: string;
    description?: string;
    users: { id: string; name: string }[];
  };
  organizationId: string;
  organizationName: string;
}) => {
  const UpdateDepartmentForm = z.object({
    name: z
      .string()
      .nonempty("Department name is required")
      .min(3, "Department name must be at least 3 characters long")
      .superRefine(async (name, ctx) => {
        const resData = await checkDepartmentExists(organizationId, name);
        if (
          resData?.department?.name &&
          resData?.department?.name !== department.name
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Department already exists",
          });
        }
      }),
    description: z.string().optional(),
    users: z.array(z.string().uuid()).optional(),
  });
  const router = useRouter();
  const [organizationUserSearch, setOrganizationUserSearch] = useState("");
  const organizationUserDebouncedSearch = useDebounce(
    organizationUserSearch,
    1000
  );
  const [organizationUsers, setOrganizationUsers] = useState<string[]>(
    department.users?.map((user: { id: string }) => user.id) || []
  );

  const queryClient = useQueryClient();
  // Fetch organization details

  type UpdateDepartmentForm = z.infer<typeof UpdateDepartmentForm>;
  //
  // Fetch organization users
  const { isPending: isOrgUserPending, data: organizationUsersData } = useQuery(
    {
      queryKey: [
        "org-user-list",
        organizationName,
        organizationUserDebouncedSearch,
      ],
      queryFn: () =>
        getOrganizationUsers(
          organizationName,
          1,
          organizationUserDebouncedSearch
        ),
      enabled: !!organizationName,
    }
  );

  // Mutation for creating a department
  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: typeof UpdateDepartmentForm._type) => {
      const currentUsers = department.users.map(
        (user: { id: string }) => user.id
      );
      // Users that were newly selected but not in the department before
      const usersToAdd = organizationUsers.filter(
        (user: string) => !currentUsers.includes(user)
      );
      // Users that were removed from the department
      const usersToRemove = currentUsers.filter(
        (user: string) => !organizationUsers.includes(user)
      );
      const departmentData = {
        id: department?.id || "",
        name: data?.name,
        description: data?.description || "",
        usersToRemove,
        usersToAdd,
      };
      return updateDepartment(departmentData);
    },
    onSuccess: (res) => {
      if (res) {
        toast({
          title: "Department Updated",
          description: "Department Updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["department-list", organizationName],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["department", department?.id],
          exact: false,
        });
        router.replace("/admin/departments");
      } else {
        toast({
          title: "Error Updating Department",
          description: res?.message || "Something went wrong",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while Updating the department",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(UpdateDepartmentForm),
    defaultValues: {
      name: department.name,
      description: department.description,
      users: department.users.map((user: { id: string }) => user.id),
    },
  });

  const onSubmit = async (data: UpdateDepartmentForm) => {
    await mutateAsync(data);
  };

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
                    value={organizationUsers
                      .map((userId) => {
                        const user = organizationUsersData?.data?.find(
                          (u: { id: string }) => u.id === userId
                        );
                        return user
                          ? { label: user.name, value: user.id }
                          : null;
                      })
                      .filter(Boolean)}
                    onChange={(newValue) => {
                      const selectedIds =
                        (newValue as unknown as { value: string }[])?.map(
                          (opt) => opt.value
                        ) || [];
                      field.onChange(selectedIds); // Update form state
                      setOrganizationUsers(selectedIds); // Update local state
                    }}
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

export default EditDepartmentForm;
