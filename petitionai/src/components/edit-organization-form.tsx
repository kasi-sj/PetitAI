"use client";

import { getOrganization, updateOrganization } from "@/actions/organization";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import SpinningProgress from "./spinning-progress";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  imageURL: z.string().url().optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  phoneNumber: z.string().min(10).max(10).optional(),
  address: z.string().optional(),
  establishedYear: z.coerce.number().optional(),
  email: z.string().email("Invalid email"),
  isActive: z.boolean(),
  similarityThreshold: z.number().min(0).max(100),
  whitelistedEmails: z
    .array(z.object({ email: z.string().email("Invalid email") }))
    .optional(),
});

const EditOrganizationForm = ({ orgName }: { orgName: string }) => {
  const router = useRouter();
  const { isPending, error, data } = useQuery({
    queryKey: ["org-detail", orgName],
    queryFn: async () => await getOrganization(orgName || ""),
  });

  const mutation = useMutation({
    mutationKey: ["update-organization"],
    mutationFn: async (data: {
      id: string;
      name?: string;
      imageURL?: string;
      description?: string;
      website?: string;
      phoneNumber?: string;
      address?: string;
      establishedYear?: number;
      email?: string;
      isActive?: boolean;
      similarityThreshold?: number;
      whitelistedEmails?: { email: string }[];
    }) => {
      const { id, ...restData } = data;
      const response = await updateOrganization(id, restData);
      console.log(response);
    },
    onSuccess: () => {
      router.push("/admin/organization");
    },
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "whitelistedEmails",
  });

    useEffect(() => {
        if (data) {
            form.reset({ ...data, whitelistedEmails: data.whitelistedEmails || [] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, form.reset]);

  const onSubmit = (formData: z.infer<typeof schema>) => {
    mutation.mutate({
      id: data.id,
      ...formData,
      establishedYear: parseInt(formData.establishedYear?.toString() || "0"),
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500 text-center py-10">
        Error loading organization details.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageURL"
              render={({ field }) => (
                <FormItem>
                  <Label>Image URL</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <Label>Phone Number</Label>
                  <FormControl>
                    <Input type="number" {...field} />
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
                  <Label>Address</Label>
                  <FormControl>
                    <Textarea {...field} rows={3} />
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
                  <Label>Description</Label>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="establishedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Established Year</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col mt-6 border-2 p-4 py-10 rounded-lg">
              <h1 className="font-bold text-lg ml-2">
                Select the Similarity Threshold for the Petition
              </h1>
              <FormField
                control={form.control}
                name="similarityThreshold"
                render={({ field }) => (
                  <FormItem className="p-2 mt-2">
                    <div className="flex justify-between items-center">
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </FormControl>
                      <span className="mx-4">({field.value})</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 mt-4">
                <AlertCircle size={14} className="text-gray-500 -mt-5 ml-2" />
                <p className="text-sm text-gray-500 w-[90%] ml-1">
                  The similarity threshold is the percentage of similarity
                  between two petitions. This threshold will be used for
                  rejecting the similar Petition.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Status
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="mr-2">Whitelisted Emails</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 my-2">
                  <Input
                    {...form.register(`whitelistedEmails.${index}.email`)}
                    placeholder="Enter email"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ email: "" })}>
                Add Email
              </Button>
            </FormItem>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EditOrganizationForm;
