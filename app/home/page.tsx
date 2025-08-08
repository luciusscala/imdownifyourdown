import { BubbleNav } from "@/components/bubble-nav";
import { TripPreviewCard } from "@/components/trip-preview-card";
import { createClient } from "@/lib/supabase/server";
import { LogOut } from "lucide-react";

const navItems = [
  {
    label: "Sign Out",
    href: "/auth/logout",
    icon: LogOut,
    variant: "outline" as const,
  },
];

interface Trip {
  id: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  participantCount: number;
  status: 'upcoming' | 'active' | 'completed';
}

async function getUserTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  
  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log("User session:", { user: user?.id, error: userError });
  
  if (userError || !user) {
    console.log("No user found, returning empty array");
    return [];
  }

  // First, let's check if there are any trip_participants at all
  const { data: allParticipants, error: allParticipantsError } = await supabase
    .from("trip_participants")
    .select("*");
  
  console.log("All participants:", allParticipants, "Error:", allParticipantsError);

  // Check if there are any trips at all
  const { data: allTrips, error: allTripsError } = await supabase
    .from("trips")
    .select("*");
  
  console.log("All trips:", allTrips, "Error:", allTripsError);

  // Fetch trips where user is a participant
  const { data: participants, error: participantsError } = await supabase
    .from("trip_participants")
    .select(`
      trip_id,
      trips (
        id,
        title,
        created_at
      )
    `)
    .eq("user_id", user.id);

  console.log("Participants query result:", { participants, error: participantsError });

  if (participantsError || !participants) {
    console.log("No participants found or error occurred");
    return [];
  }

  console.log("Raw participants data:", participants);

  // Transform the data to match our interface
  const trips: Trip[] = participants
    .filter((participant) => {
      console.log("Checking participant:", participant);
      const tripData = participant.trips as unknown as { id: string; title: string; created_at: string };
      return tripData && tripData.id;
    })
    .map((participant) => {
      console.log("Mapping participant:", participant);
      const tripData = participant.trips as unknown as { id: string; title: string; created_at: string };
      return {
        id: tripData.id,
        title: tripData.title,
        location: "TBD", // This would come from trip details
        startDate: "TBD", // This would come from trip details
        endDate: "TBD", // This would come from trip details
        participantCount: 1, // This would be calculated from participants
        status: "upcoming" as const, // This would be determined by dates
      };
    });

  console.log("Final trips array:", trips);
  return trips;
}

export default async function Home() {
  const trips = await getUserTrips();
  console.log("Home component received trips:", trips);

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Trip Preview Card */}
          <TripPreviewCard trips={trips} />
        </div>
      </main>
      <BubbleNav items={navItems} />
    </>
  );
} 