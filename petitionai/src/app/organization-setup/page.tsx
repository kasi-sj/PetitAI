"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { createOrganizations, getOrganization } from "@/actions/organization";
import { useUserStore } from "@/utils/store";

const formSchema = z.object({
  name: z.string().min(1, "Organization name is required").refine((name) => {
    if (/\s/.test(name)) {
      return false;
    }
    return true;
  }, {
    message: "Organization name should not contain spaces"
  }).refine(async (name) => {
    try {
      const result = await getOrganization(name)
      if (result) return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return true
    }
    return false
  }, {
    message: "Organization with this name already exist"
  }),
  imageURL: z.string().url().optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  phoneNumber: z.string().min(10).max(10).optional(),
  address: z.string().optional(),
  establishedYear: z.string().refine((val) => /^\d{4}$/.test(val), {
    message: "Must be a valid year (YYYY)",
  }),
  email: z.string().email("Invalid email address"),
  similarityThreshold: z.number().min(0).max(100),
  departments: z.array(
    z.object({
      name: z.string().min(1, "Department name is required"),
      description: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  "Primary Information",
  "Additional Information",
  "Settings",
  "Departments",
  "Review",
];

const stepFields: (keyof FormValues)[][] = [
  ["name", "establishedYear", "website", "email"],
  ["imageURL", "phoneNumber", "address", "description"],
  ["similarityThreshold"],
  ["departments"],
  [
    "name",
    "establishedYear",
    "website",
    "imageURL",
    "phoneNumber",
    "address",
    "description",
    "similarityThreshold",
    "email",
    "departments",
  ],
];

export default function OrganizationSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { user } = useUserStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageURL: "",
      description: "",
      website: "",
      phoneNumber: '1234567890',
      address: "",
      establishedYear: "",
      email: "",
      similarityThreshold: 90,
      departments: [{ name: "", description: "" }],
    },
  });

  const values = form.getValues()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "departments",
  });

  const mutation = useMutation({
    mutationKey : ["createOrganization" , user.userId],
    mutationFn: async (data: FormValues) => {
      // Replace with actual API call
      const response = await createOrganizations({
        ...data,
        userId: user.userId,
      })
      console.log(response)

      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Organization created",
        description: "Organization setup completed successfully",
      });
      router.push("/admin");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    },
  });

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      const isValid = await form.trigger(stepFields[currentStep]);
      console.log(isValid)
      if (isValid) setIsConfirmDialogOpen(true);
    } else {
      const isValid = await form.trigger(stepFields[currentStep]);
      if (isValid) setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">

      <Form {...form}>
        <Card className="w-full max-w-3xl shadow-lg rounded-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-xl my-5 font-semibold">
              Organization Setup
            </CardTitle>
            <div className="w-full flex justify-center gap-2 mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all ${currentStep >= index ? "bg-primary" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Organization Name</Label>
                      <FormControl>
                        <Input {...field} />
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
                      <Label>Email </Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="establishedYear"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Established Year</Label>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="YYYY"
                            min="1800"
                            max={new Date().getFullYear()}
                          />
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
                        <Label>Website</Label>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-1 gap-4">
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
              </div>
            )}

            {currentStep === 2 && (
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
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="max-h-80 overflow-y-auto flex flex-col gap-4 rounded-lg p-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Department {index + 1}</h3>
                        {index > 0 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`departments.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Department Name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`departments.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Description"
                                  rows={5}
                                  maxLength={500}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-left">
                  Review Your Details
                </h2>

                <Accordion type="single" collapsible>
                  {/* Primary Information */}
                  <AccordionItem value="primary">
                    <AccordionTrigger>Primary Information</AccordionTrigger>
                    <AccordionContent>
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={values.name}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />

                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Established Year
                      </label>
                      <input
                        type="text"
                        value={values.establishedYear}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />

                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Website
                      </label>
                      <input
                        type="text"
                        value={values.website}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Additional Information */}
                  <AccordionItem value="additional">
                    <AccordionTrigger>Additional Information</AccordionTrigger>
                    <AccordionContent>
                      <label className="block text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={values.imageURL}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />

                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={values.phoneNumber}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />

                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={values.address}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />

                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Description
                      </label>
                      <textarea
                        value={values.description}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      ></textarea>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Settings */}
                  <AccordionItem value="settings">
                    <AccordionTrigger>Settings</AccordionTrigger>
                    <AccordionContent>
                      <label className="block text-sm font-medium text-gray-700">
                        Similarity Threshold
                      </label>
                      <input
                        type="text"
                        value={`${values.similarityThreshold}%`}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                      />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Departments */}
                  <AccordionItem value="departments">
                    <AccordionTrigger>Departments</AccordionTrigger>
                    <AccordionContent>
                      {values.departments.length > 0 ? (
                        values.departments.map((dept, index) => (
                          <div key={index} className="p-2 border rounded-lg mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Department {index + 1}
                            </label>
                            <input
                              type="text"
                              value={dept.name}
                              disabled
                              className="w-full border rounded-lg p-2 bg-gray-100"
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                              Description
                            </label>
                            <textarea
                              value={dept.description}
                              disabled
                              className="w-full border rounded-lg p-2 bg-gray-100"
                            ></textarea>
                          </div>
                        ))
                      ) : (
                        <p>No departments added.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <div className="flex gap-2">
              {currentStep === 3 && (
                <Button
                  onClick={() => append({ name: "", description: "" })}
                  variant="outline"
                >
                  Add Department
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={mutation.isPending}
              >
                {currentStep === steps.length - 1
                  ? "Complete Setup"
                  : "Next"}
                {mutation.isPending && "..."}
              </Button>
            </div>
          </CardFooter>
        </Card>
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Organization Creation</AlertDialogTitle>
              <AlertDialogDescription>
                This action will create:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <span className="font-medium">Organization:</span> {values.name}
                  </li>
                  <li>
                    <span className="font-medium">Departments:</span>{" "}
                    {values.departments.length} department(s) including{" "}
                    {values.departments.slice(0, 3).map((d) => d.name).join(", ")}
                    {values.departments.length > 3 && " and more"}
                  </li>
                  <li>
                    <span className="font-medium">User Roles:</span>
                    <ul className="list-[circle] pl-6 mt-1">
                      <li>Lower Level (Priority 0)</li>
                      <li>Higher Level (Priority 100)</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">Automated Users:</span>
                    <ul className="list-[circle] pl-6 mt-1">
                      <li>1 user per department with Lower Level role</li>
                      <li>1 administrative user with Higher Level role</li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-4 text-red-500 font-medium">
                  Are you sure you want to proceed with this setup?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => form.handleSubmit((data) => mutation.mutate(data))()}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Confirm Creation"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
    </div>
  );
}