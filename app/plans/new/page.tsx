"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreatePlanForm } from "@/components/create-plan-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewPlanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(data: any) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create plan");
      const { id } = await res.json();
      toast.success("Plan created!");
      router.push(`/plans/${id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create plan");
    } finally {
      setSubmitting(false);
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