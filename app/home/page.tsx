"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/client";

// Trip type based on schema
interface Trip {
  id: string;
  title: string;
  created_at: string;
}

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
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
        
        // Fetch trips where user is the host
        const { data, error: tripsError } = await supabase
          .from("trips")
          .select("id, title, created_at")
          .eq("host_id", userId)
          .order("created_at", { ascending: false });
          
        if (tripsError) throw tripsError;
        setTrips(data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load trips";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Your Trips</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/trips/new")}>Create New Trip</Button>
          <LogoutButton />
        </div>
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
                    <Skeleton className="h-8 w-24 mt-2" />
                  </CardContent>
                </Card>
              ))
            : trips.length === 0
            ? <div className="text-muted-foreground text-center py-8">No trips found. Create your first trip!</div>
            : trips.map((trip) => (
                <Card key={trip.id} className="flex flex-col md:flex-row md:items-center justify-between">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/trips/${trip.id}`)}
                      className="w-full md:w-auto"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
      </ScrollArea>
    </main>
  );
} 