"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plane, Home, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(100, "Title must be less than 100 characters"),
  flightLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  lodgingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CreateTripFormData = z.infer<typeof createTripSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      flightLink: "",
      lodgingLink: "",
    },
  });

  const onSubmit = async (data: CreateTripFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/trips/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create trip");
      }

      const { tripId } = await response.json();
      toast.success("Trip created successfully!");
      router.push(`/trips/${tripId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      console.error("Trip creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
          <p className="mt-2 text-gray-600">
            Add your trip details and we&apos;ll help you organize your itinerary.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Trip Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Trip Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Summer Vacation to Paris"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Flight Link */}
                <FormField
                  control={form.control}
                  name="flightLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        Flight Link (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://flights.example.com/booking/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lodging Link */}
                <FormField
                  control={form.control}
                  name="lodgingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Lodging Link (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://airbnb.com/rooms/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Info Alert */}
                <Alert>
                  <Plane className="h-4 w-4" />
                  <AlertDescription>
                    We&apos;ll automatically parse your flight and lodging information to create a detailed itinerary. 
                    You can add more details later.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Trip...
                      </>
                    ) : (
                      "Create Trip"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 