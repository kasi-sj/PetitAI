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
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { createUserRole, checkRoleExists } from "@/actions/userRole";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

// ✅ Define the Schema

interface CreateRoleFormProps {
  organizationId: string;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ organizationId }) => {
  const createRoleSchema = z.object({
    roleName: z
      .string()
      .nonempty("Role name is required")
      .min(3, "Role name must be at least 3 characters long")
      .superRefine(async (name, ctx) => {
        const resData = await checkRoleExists(organizationId, name);
        console.log("RES DATA", resData?.role?.id);
        if (resData?.role?.id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Role already exists",
          });
        }
      }),
    priority: z
      .number({ invalid_type_error: "Priority must be a positive integer" })
      .max(100)
      .int()
      .positive(),
  });

  // ✅ Define TypeScript Type
  type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roleName: "",
      priority: 0,
    },
  });

  const router = useRouter();

  // ✅ Mutation using React Query
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: CreateRoleFormValues) => {
      return createUserRole(organizationId, data.roleName, data.priority);
    },
    onSuccess: (res) => {
      if (res?.status === 201) {
        toast({
          color: "green",
          title: "User Role Added",
          description: "User role added successfully",
        });
        router.push("/admin/user-roles");
      } else {
        toast({
          title: "Error Adding User Role",
          description: "Error adding user role",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while adding the user role",
      });
    },
  });

  const onSubmit = async (data: CreateRoleFormValues) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Name */}
        <FormField
          control={form.control}
          name="roleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter role name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter priority"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoleForm;
