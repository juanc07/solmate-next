"use client"; // Designates this as a Client Component

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { ITitleProps } from "@/lib/interfaces";

// Define form schema with Zod
const FormSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(1, "Message is required"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
});

// Define TypeScript type for form data
type FormData = z.infer<typeof FormSchema>;

const HorizontalContactForm: React.FC<ITitleProps> = ({ title }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      terms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Show a toast that the submission is in progress
      toast({
        title: "Submitting...",
        description: "Your form is being submitted. Please wait.",
      });

      // Send form data to the API endpoint
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send the message. Please try again later.");
      }

      // Show a success toast
      toast({
        title: "Form Submitted",
        description: "Your message has been sent successfully!",
      });

      // Reset the form after successful submission
      form.reset();
    } catch (error: any) {
      // Show an error toast
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{title}</h2>

      <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-lg shadow-lg max-w-4xl w-full transition-colors duration-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    {form.formState.errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Company
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Company Name"
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    {form.formState.errors.company && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.company.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com"
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    {form.formState.errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    {form.formState.errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your message here"
                      className="w-full h-32 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  {form.formState.errors.message && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Terms */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 text-left">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded mt-4"
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Accept terms and conditions
                    </FormLabel>
                    <FormDescription className="text-gray-600 dark:text-gray-400">
                      I agree to the terms and conditions provided by the company.
                    </FormDescription>
                    {form.formState.errors.terms && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.terms.message}
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <Button
                type="submit"
                className="bg-blue-600 dark:bg-blue-500 text-white h-12 px-6 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
              >
                Send Message
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HorizontalContactForm;
