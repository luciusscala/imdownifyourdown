"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Plane, Home, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BubbleNav } from "@/components/bubble-nav";

// Form validation schema
const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(100, "Title must be less than 100 characters"),
  flightLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  lodgingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CreateTripFormData = z.infer<typeof createTripSchema>;

const navItems = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
    variant: "ghost" as const,
  },
];

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
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-[#606c38] hover:bg-[#606c38]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Form Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Trip Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#606c38] font-medium">
                          Trip Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer Vacation to Paris"
                            {...field}
                            className="border-[#606c38]/20 focus:border-[#606c38] focus:ring-[#606c38]/20"
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
                        <FormLabel className="text-[#606c38] font-medium flex items-center gap-2">
                          <Plane className="h-4 w-4" />
                          Flight Link (Optional but recommended)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://flights.example.com/booking/..."
                            {...field}
                            className="border-[#606c38]/20 focus:border-[#606c38] focus:ring-[#606c38]/20"
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
                        <FormLabel className="text-[#606c38] font-medium flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Lodging Link (Optional but recommended)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://airbnb.com/rooms/..."
                            {...field}
                            className="border-[#606c38]/20 focus:border-[#606c38] focus:ring-[#606c38]/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#606c38] hover:bg-[#606c38]/90 text-white font-medium py-3" 
                    disabled={isSubmitting}
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
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <BubbleNav items={navItems} />
    </>
  );
} 