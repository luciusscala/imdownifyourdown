"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";

// Plan type based on schema
interface Plan {
  id: string;
  title: string;
  destination: string;
  departure_date: string;
  return_date: string;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        // Get user session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        const userId = session.user.id;
        // Fetch plans where user is host or participant
        const { data, error: plansError } = await supabase
          .from("plans")
          .select("id, title, destination, departure_date, return_date, host_id")
          .or(`host_id.eq.${userId}`);
        if (plansError) throw plansError;
        setPlans(
          (data || []).map((plan: {
            id: string;
            title: string;
            destination: string;
            departure_date: string;
            return_date: string;
          }) => ({
            id: plan.id,
            title: plan.title,
            destination: plan.destination,
            departure_date: plan.departure_date,
            return_date: plan.return_date,
          }))
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load plans";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <Button onClick={() => router.push("/plans/new")}>Create New Plan</Button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <ScrollArea className="h-[60vh] w-full rounded-md border">
        <div className="flex flex-col gap-4 p-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-6 w-1/2 mb-2" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-8 w-24 mt-2" />
                  </CardContent>
                </Card>
              ))
            : plans.length === 0
            ? <div className="text-muted-foreground text-center py-8">No plans found.</div>
            : plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col md:flex-row md:items-center justify-between">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                    <div className="flex flex-col md:flex-row md:gap-4 flex-1">
                      <span className="text-sm text-muted-foreground">
                        Destination: <span className="font-medium text-foreground">{plan.destination}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Departure: <span className="font-medium text-foreground">{new Date(plan.departure_date).toLocaleDateString()}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Return: <span className="font-medium text-foreground">{new Date(plan.return_date).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/plans/${plan.id}`)}
                      className="w-full md:w-auto"
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
      </ScrollArea>
    </main>
  );
} 