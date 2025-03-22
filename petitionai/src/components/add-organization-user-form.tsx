"use client";
import React, {  useEffect } from "react";
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
// import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card";
import Select from "react-select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/actions/department";
import { getUserRoles } from "@/actions/userRole";
import SpinningProgress from "./spinning-progress";
import { Input } from "./ui/input";
import {
  checkUserExist,
  getReportTo,
  putOrganizationUser,
} from "@/actions/organizationUser";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getOrganization } from "@/actions/organization";
import { useDebounce } from "@/hooks/use-debounce";

type Trole = {
  roleName: string;
  id: string;
};

const AddOrganizationUserForm = ({
  organizationName,
}: {
  organizationName: string;
}) => {
  const formSchema = z.object({
    name: z
      .string()
      .nonempty("User is required")
      .min(3)
      .superRefine(async (data, ctx) => {
        const resData = await checkUserExist(organizationName, data);
        if (resData) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "User already exist",
          });
        }
      }),
    organization: z.string().nonempty("Organization is required"), //
    department: z.string().optional(), //
    role: z.string().nonempty("Role is required"), //
    reportTo: z.string().optional(),
    isActive: z.boolean(), //
    password: z.string().nonempty("Password is required").min(6),
    email: z.string().email("Invalid email"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      name: "",
      password: "",
      organization: organizationName,
      department: "",
      role: "",
      reportTo: "",
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
  const router = useRouter();

  useEffect(() => {
    // if(!selectedRole){
    setValue("reportTo", "");
    // }
  }, [selectedRole, setValue]);

  const {
    isPending: isSubmitLoading,
    mutateAsync,
    error: submitError,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // const userData = await userCustomQuery({ email: values.user });

      const organization = await getOrganization(organizationName);
      const organizationId = organization.id;
      const organizationUserObject = {
        organizationId: organizationId,
        departmentId: values.department || undefined,
        roleId: values.role,
        reportToId: values.reportTo ? values?.reportTo : undefined,
        hashedPassword: values.password,
        name: values.name,
        isActive: values.isActive,
        email: values.email,
      };

      const response = await putOrganizationUser(organizationUserObject);
      return response;
    },
    mutationKey: [
      "organization-submit-form",
      organizationName,
      form.getValues(),
    ],
    onSuccess: () => {
      // queryClient
      toast({
        title: "User Added",
        description: "Organization user added successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["org-user-list", organizationName],
      });
      router.push("/admin/users");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values);
  }

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

  //need to implement search
  const { data: reportToData, isPending: reportToPending } = useQuery({
    queryKey: [
      "report-to-form",
      organizationName,
      selectedRole,
      reportToDebounce,
    ],
    queryFn: () => getReportTo(selectedRole, 1, reportToDebounce),
    enabled: !!(isFirst || reportToDebounce),
  });

  return (
    <div className="p-6 mt-20 flex justify-center">
      <Card className="p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Create User</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Organization name"
                      {...field}
                      disabled={true}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="User password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the password of the user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-black ">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Role</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select a Role"
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
                            return field.onChange(newValue.value);
                          }
                        }}
                        onInputChange={setRoleSearch}
                        isLoading={rolePending}
                        options={roleData?.map((role: Trole) => ({
                          label: role.roleName,
                          value: role.id,
                        }))}
                      />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Report To</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select a ReportTo"
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
                      />
                    </FormControl>
                    <FormDescription>
                      These are the users to whom the user reports
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Department</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select a Department"
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
                      />
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
              <Button type="submit">
                Submit {isSubmitLoading && <SpinningProgress size={8} />}
              </Button>
              {submitError && (
                <div className="text-red-500">{submitError.message}</div>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddOrganizationUserForm;
