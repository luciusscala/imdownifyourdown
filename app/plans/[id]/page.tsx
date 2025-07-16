"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TimelineItinerary } from "@/components/timeline-itinerary";
import { ArrowLeft, Users, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Plan {
  id: string;
  title: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  flight_link?: string;
  lodge_link?: string;
  host_id: string;
}

interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time_utc: string;
  arrival_time_utc: string;
}

interface Lodging {
  id: string;
  name: string;
  location: string;
  number_of_guests: number;
  check_in: string;
  check_out: string;
  home_link: string;
}

interface Participant {
  id: string;
  status: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

interface PlanData {
  plan: Plan;
  flights: Flight[];
  lodging: Lodging[];
  participants: Participant[];
}

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  
  const [data, setData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/plans/${planId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch plan");
        }
        const planData = await res.json();
        setData(planData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load plan";
        setError(message);
        toast.error("Failed to load plan");
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  const handleCommitToJoin = async () => {
    // TODO: Implement commit functionality
    toast.success("Commitment feature coming soon!");
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The plan you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/plans")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        </div>
      </main>
    );
  }

  const { plan, flights, lodging, participants } = data;
  const primaryLodging = lodging[0]; // Assuming one lodging per plan for MVP

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/plans")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{plan.title}</h1>
          <p className="text-muted-foreground">
            {plan.origin} → {plan.destination}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Trip Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-medium">{format(new Date(plan.departure_date), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Return</p>
                  <p className="font-medium">{format(new Date(plan.return_date), "PPP")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {plan.origin}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {plan.destination}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          {flights.length > 0 && primaryLodging && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
              <TimelineItinerary
                flights={flights}
                lodging={primaryLodging}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No participants yet</p>
                ) : (
                  participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {participant.profiles?.full_name || participant.profiles?.email || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {participant.profiles?.email}
                        </p>
                      </div>
                      <Badge variant={participant.status === "committed" ? "default" : "secondary"}>
                        {participant.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleCommitToJoin} 
                className="w-full"
                size="lg"
              >
                Commit to Join
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Once enough people commit, we&apos;ll finalize the booking
              </p>
            </CardContent>
          </Card>

          {/* Links */}
          {(plan.flight_link || plan.lodge_link) && (
            <Card>
              <CardHeader>
                <CardTitle>Original Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {plan.flight_link && (
                  <a
                    href={plan.flight_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    View Flight Details →
                  </a>
                )}
                {plan.lodge_link && (
                  <a
                    href={plan.lodge_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    View Lodging Details →
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}