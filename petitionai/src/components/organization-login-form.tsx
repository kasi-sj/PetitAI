"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOrganizations } from "@/actions/organization";
import { loginOrganizationUser } from "@/actions/organizationUser";
import { useDebounce } from "@/hooks/use-debounce";
import { useOrganizationUser } from "@/utils/store";
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  organization: z.string().nonempty("Organization is required"),
  name: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function OrganizationLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserOrganizationUser } = useOrganizationUser();
  const { id } = useOrganizationUser((state) => state.user);
  const router = useRouter();
  const [isFirst] = useState(true);

  // Fetch organizations dynamically
  const { data, isLoading } = useQuery({
    queryKey: ["search", search],
    queryFn: () => getOrganizations(search),
    enabled: !!(isFirst || debouncedSearch), // Prevents unnecessary requests
  });
  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
    setLoading(true);
    setErrorMessage("");
    const result = await loginOrganizationUser(
      data.organization,
      data.name,
      data.password
    );
    console.log(result);
    setLoading(false);

    if (result) {
      setUserOrganizationUser(
        result.id,
        result.department,
        result.organization
      );
      router.push(`/organization-user`);
    } else {
      setErrorMessage(result?.message || "Invalid username or password");
    }
  };

  if (id) {
    router.push(`/organization-user`);
  }

  return (
    <div className="flex h-screen bg-white items-center justify-center">
      <div className="w-[800px] h-[500px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-slate-500 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Sign in to PetitAI
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Organization Dropdown */}
              <div className="text-black">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Organization</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select an organization"
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
                          onInputChange={setSearch}
                          isLoading={isLoading}
                          options={data?.map(
                            (org: { name: string; id: string }) => ({
                              label: org.name,
                              value: org.id,
                            })
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Username */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-white text-black border focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-2 rounded-lg bg-white text-black border focus:ring-2 focus:ring-blue-500 pr-10"
                          placeholder="Type your password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <AiFillEyeInvisible size={20} />
                          ) : (
                            <AiFillEye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              {errorMessage && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
              )}
            </form>
          </Form>
        </div>
        {/* Right Side Image */}
        <div className="w-1/2 bg-slate-800 flex items-center justify-center text-white p-10">
          <Image src="/login.jpg" alt="log" width={320} height={320} />
        </div>
      </div>
    </div>
  );
}
