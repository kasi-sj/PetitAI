"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";
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
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrganizations } from "@/actions/organization";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addPetition } from "@/actions/petition";
import SpinningProgress from "./spinning-progress";
import { useUserStore } from "@/utils/store";

const formSchema = z.object({
  organization: z.string().min(2, {
    message: "Organization must be selected.",
  }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters long.",
  }),
  body: z.string().min(10, {
    message: "Body must be at least 10 characters long.",
  }),
});

export function CreatePetitionForm() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [isFirst, setIsFirst] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ["search", search],
    queryFn: () => getOrganizations(search),
    enabled: !!(isFirst || debouncedSearch), // Prevents unnecessary requests
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
    }
  }, [isFirst]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      subject: "",
      body: "",
    },
  });

  const user = useUserStore((state) => state.user?.userId) || " ";

  const {
    isPending: isSubmitLoading,
    mutateAsync,
    error: submitError,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { organization, subject, body } = values;
      const userId = user || "";
      return await addPetition({
        organizationId: organization,
        subject,
        body,
        userId,
      });
    },
    mutationKey: ["organization-submit-form", user],
    onSuccess: () => {
      // queryClient
      toast({
        title: "Petition Added",
        description: "Petition added successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["getting-user-organizations", user],
      });
      router.back();
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an organization"
                  classNames={{
                    control: () =>
                      "min-h-[30px] text-[14px] border border-gray-300 rounded-md",
                    dropdownIndicator: () => "p-[4px]",
                    clearIndicator: () => "p-[4px]",
                    multiValue: () => "bg-gray-300 px-2 py-0.5 rounded",
                    valueContainer: () => "px-[6px] text-[14px]",
                    input: () => "m-0 p-0 text-[14px]",
                  }}
                  onChange={(
                    newValue: { label: string; value: string } | null
                  ) => {
                    if (newValue) {
                      return field.onChange(newValue.value);
                    }
                  }}
                  onInputChange={(value: string) => {
                    setSearch(value);
                  }}
                  isLoading={isLoading}
                  options={data?.map((org: { name: string; id: string }) => ({
                    label: org.name,
                    value: org.id,
                  }))}
                />
              </FormControl>
              <FormDescription>
                This is the organization to which the petition will be sent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Social & Civic Issues" {...field} />
              </FormControl>
              <FormDescription>
                This is the subject of the petition.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here."
                  {...field}
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormDescription>
                This is the body of the petition.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
  );
}
