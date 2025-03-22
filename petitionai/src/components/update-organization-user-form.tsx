"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card } from "@/components/ui/card";
import Select from "react-select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/actions/department";
import { getUserRoles } from "@/actions/userRole";
import { Input } from "./ui/input";
import {
  checkUserExist,
  getReportTo,
  updateOrganizationUser,
} from "@/actions/organizationUser";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

type Trole = {
  roleName: string;
  id: string;
};

type UserFormData = {
  id: string;
  name: string;
  organization: string;
  departmentId: string;
  role: { id: string };
  reportTo?: { id: string };
  isActive: boolean;
  email: string;
};

const EditOrganizationUserForm = ({
  user,
  organizationName,
  isOrganizationUser,
}: {
  user: UserFormData;
  organizationName: string;
  isOrganizationUser?: boolean;
}) => {
  const formSchema = z.object({
    name: z
      .string()
      .nonempty("User is required")
      .min(3)
      .superRefine(async (data, ctx) => {
        const resData = await checkUserExist(organizationName, data);
        if (resData && resData?.name !== user?.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "User already exist",
          });
        }
      }),
    organization: z.string().nonempty("Organization is required"),
    department: z.string().optional(),
    role: z.string().nonempty("Role is required"),
    reportTo: z.string().optional(),
    isActive: z.boolean(),
    email: z.string().email("Invalid email").optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: user.isActive,
      name: user.name,
      organization: organizationName,
      department: user.departmentId || "",
      role: user.role.id,
      reportTo: user.reportTo?.id || "",
      email: user.email || "",
    },
  });

  const { toast } = useToast();

  const queryClient = new QueryClient();
  const selectedRole = form.watch("role");
  const [reportToSearch, setReportToSearch] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [isFirst] = useState(true);
  const reportToDebounce = useDebounce(reportToSearch, 1000);
  const departmentDebounce = useDebounce(departmentSearch, 1000);
  const roleDebounce = useDebounce(roleSearch, 1000);
  const setValue = form.setValue;
  const [role, setRole] = useState(user.role.id);
  const [department, setDepartment] = useState(user.departmentId);
  const [reportTo, setReportTo] = useState(user.reportTo?.id);
  const router = useRouter();

  useEffect(() => {
    setValue("reportTo", "");
  }, [selectedRole, setValue]);

  const { data: departmentData, isPending: departmentPending } = useQuery({
    queryKey: ["org-user-dept-form", organizationName, departmentDebounce],
    queryFn: () => getDepartments(organizationName, 1, departmentDebounce),
    enabled: !!(isFirst || departmentDebounce),
  });

  const { data: roleData, isPending: rolePending } = useQuery({
    queryKey: ["user-roles-dept-form", organizationName, roleDebounce],
    queryFn: async () => {
      const userRoles = await getUserRoles(organizationName, 1, roleDebounce);
      return userRoles?.data?.filter((role: Trole) => role.roleName != "Admin");
    },
    enabled: !!(isFirst || roleDebounce),
  });

  const { data: reportToData, isPending: reportToPending } = useQuery({
    queryKey: [
      "report-to-form",
      user.organization,
      role,
      selectedRole,
      reportToDebounce,
    ],
    queryFn: () => getReportTo(selectedRole, 1, reportToDebounce),
    enabled: !!(isFirst || reportToDebounce),
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const updateOrganizationUserObject: {
        userId: string;
        organizationId: string;
        departmentId: string | undefined;
        roleId: string;
        reportToId: string | undefined;
        name: string;
        isActive: boolean;
        email: string | undefined;
      } = {
        userId: user.id,
        organizationId: user.organization,
        departmentId: values.department,
        roleId: values.role,
        reportToId: values.reportTo,
        name: values.name,
        isActive: values.isActive,
        email: values.email,
      };

      await updateOrganizationUser(updateOrganizationUserObject);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["org-user-list", organizationName],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["organizationUser", user.id],
        exact: false,
      });

      toast({
        title: "User updated",
        description: "User has been updated successfully",
      });
      router.back();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateMutation.mutateAsync(values);
  }

  return (
    <div className="p-6 mt-20 flex justify-center">
      <Card className="p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Update User</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              defaultValue={user?.name || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="User name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              disabled={true}
              defaultValue={organizationName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Organization name"
                      {...field}
                      disabled={true}
                      value={organizationName}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the organization of the user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              defaultValue={user?.email || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="User email" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the email of the user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-black ">
              <FormField
                control={form.control}
                name="role"
                disabled={isOrganizationUser}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Role</FormLabel>
                    <FormControl>
                      {!isOrganizationUser ? (
                        <Select
                          placeholder="Select a Role"
                          value={
                            roleData
                              ?.map((d: { roleName: string; id: string }) => ({
                                label: d.roleName,
                                value: d.id,
                              }))
                              .find(
                                (d: { label: string; value: string }) =>
                                  d.value === role
                              ) || null
                          }
                          classNames={{
                            control: () =>
                              "min-h-[30px] text-[14px] border border-gray-300 rounded-md",
                            dropdownIndicator: () => "px-[4px]",
                            clearIndicator: () => "px-[4px]",
                            multiValue: () => "bg-gray-300 px-2 py-0.5 rounded",
                            valueContainer: () =>
                              "px-[6px] text-[14px] text-black",
                            input: () => "m-0 p-0 text-[14px] text-black",
                            option: () => "text-[14px] text-black",
                          }}
                          onChange={(
                            newValue: { label: string; value: string } | null
                          ) => {
                            if (newValue) {
                              setRole(newValue.value);
                              return field.onChange(newValue.value);
                            }
                          }}
                          onInputChange={setRoleSearch}
                          isLoading={rolePending}
                          options={roleData?.map((role: Trole) => ({
                            label: role.roleName,
                            value: role.id,
                          }))}
                        />) :
                        <Input placeholder="Role" {...field} value={roleData
                          ?.map((d: { roleName: string; id: string }) => ({
                            label: d.roleName,
                            value: d.id,
                          }))
                          .find(
                            (d: { label: string; value: string }) =>
                              d.value === role
                          ).label || null} />}
                    </FormControl>
                    <FormDescription>
                      These are organizational roles
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reportTo"
                disabled={isOrganizationUser}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Report To</FormLabel>
                    <FormControl>
                      {!isOrganizationUser ?
                        <Select
                          placeholder="Select a ReportTo"
                          value={
                            reportToData
                              ?.map((d: { name: string; id: string }) => ({
                                label: d.name,
                                value: d.id,
                              }))
                              .find(
                                (d: { label: string; value: string }) =>
                                  d.value === reportTo
                              ) || null
                          }
                          classNames={{
                            control: () =>
                              "min-h-[30px] text-[14px] border border-gray-300 rounded-md",
                            dropdownIndicator: () => "p-[4px]",
                            clearIndicator: () => "p-[4px]",
                            multiValue: () => "bg-gray-300 px-2 py-0.5 rounded",
                            valueContainer: () =>
                              "px-[6px] text-[14px] text-black",
                            input: () => "m-0 p-0 text-[14px] text-black",
                            option: () => "text-[14px] text-black",
                          }}
                          onChange={(
                            newValue: { label: string; value: string } | null
                          ) => {
                            if (newValue) {
                              setReportTo(newValue.value);
                              return field.onChange(newValue.value);
                            }
                          }}
                          onInputChange={setReportToSearch}
                          isLoading={reportToPending}
                          options={reportToData?.map(
                            (reportToUser: { name: string; id: string }) => ({
                              label: reportToUser.name,
                              value: reportToUser.id,
                            })
                          )}
                        /> :
                        <Input placeholder="ReportTo" {...field} />
                      }
                    </FormControl>
                    <FormDescription>
                      This is the user reports to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                disabled={isOrganizationUser}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Department</FormLabel>
                    <FormControl>
                      {!isOrganizationUser ?
                        <Select
                          placeholder="Select a Department"
                          value={
                            departmentData?.data
                              ?.map((d: { name: string; id: string }) => ({
                                label: d.name,
                                value: d.id,
                              }))
                              .find(
                                (d: { label: string; value: string }) =>
                                  d.value === department
                              ) || null
                          }
                          classNames={{
                            control: () =>
                              "min-h-[30px] text-[14px] border border-gray-300 rounded-md",
                            dropdownIndicator: () => "p-[4px]",
                            clearIndicator: () => "p-[4px]",
                            multiValue: () => "bg-gray-300 px-2 py-0.5 rounded",
                            valueContainer: () =>
                              "px-[6px] text-[14px] text-black",
                            input: () => "m-0 p-0 text-[14px] text-black",
                            option: () => "text-[14px] text-black",
                          }}
                          onChange={(
                            newValue: { label: string; value: string } | null
                          ) => {
                            if (newValue) {
                              setDepartment(newValue.value);
                              return field.onChange(newValue.value);
                            }
                          }}
                          onInputChange={setDepartmentSearch}
                          isLoading={departmentPending}
                          options={departmentData?.data?.map(
                            (department: { name: string; id: string }) => ({
                              label: department.name,
                              value: department.id,
                            })
                          )}
                        /> : <Input placeholder="Department" {...field} value={departmentData?.data
                          ?.map((d: { name: string; id: string }) => ({
                            label: d.name,
                            value: d.id,
                          }))
                          .find(
                            (d: { label: string; value: string }) =>
                              d.value === department
                          ).label || null} />}

                    </FormControl>
                    <FormDescription>
                      These are organizational departments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Active Status</FormLabel>
              <FormControl>
                <div>
                  <Switch
                    id="airplane-mode"
                    checked={form.watch("isActive")}
                    onChange={() => {
                      form.setValue("isActive", !form.watch("isActive"));
                    }}
                  />
                  <Label htmlFor="airplane-mode" className="pl-2">
                    {form.watch("isActive") ? "Active" : "Not Active"}
                  </Label>
                </div>
              </FormControl>
              <FormDescription>
                This is the active status of the creating user
              </FormDescription>
              <FormMessage />
            </FormItem>
            <div>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};
export default EditOrganizationUserForm;
