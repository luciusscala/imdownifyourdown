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
  if (userError || !user) {
    return [];
  }

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

  if (participantsError || !participants) {
    return [];
  }

  // Transform the data to match our interface
  const trips: Trip[] = participants.map((participant: any) => ({
    id: participant.trips.id,
    title: participant.trips.title,
    location: "TBD", // This would come from trip details
    startDate: "TBD", // This would come from trip details
    endDate: "TBD", // This would come from trip details
    participantCount: 1, // This would be calculated from participants
    status: "upcoming" as const, // This would be determined by dates
  }));

  return trips;
}

export default async function Home() {
  const trips = await getUserTrips();

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