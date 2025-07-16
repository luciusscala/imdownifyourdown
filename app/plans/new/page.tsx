"use client";

import { useRouter } from "next/navigation";
import { CreatePlanForm } from "@/components/create-plan-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewPlanPage() {
  const router = useRouter();
  async function handleSubmit(data: {
    title: string;
    departure_date: Date;
    return_date: Date;
    origin: string;
    destination: string;
    flight_link?: string;
    lodge_link?: string;
  }) {
    try {
      const payload = {
        ...data,
        departure_date: data.departure_date instanceof Date ? data.departure_date.toISOString() : data.departure_date,
        return_date: data.return_date instanceof Date ? data.return_date.toISOString() : data.return_date,
      };
      const res = await fetch("/api/plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create plan");
      const { planId } = await res.json();
      toast.success("Plan created!");
      router.push(`/plans/${planId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create plan";
      toast.error(message);
    }
  }

  return (
    <main className="max-w-xl mx-auto py-10 px-4 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePlanForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </main>
  );
} 