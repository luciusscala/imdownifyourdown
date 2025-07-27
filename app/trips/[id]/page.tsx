import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TripHeader } from "@/components/trip/trip-header";
import { FlightTimeline } from "@/components/trip/flight-timeline";
import { LodgingDetails } from "@/components/trip/lodging-details";
import { CostBreakdown } from "@/components/trip/cost-breakdown";
import { ParticipantList } from "@/components/trip/participant-list";
import { TripResponse } from "@/lib/types/trip";

interface TripPageProps {
  params: Promise<{ id: string }>;
}

async function getTripData(tripId: string): Promise<TripResponse> {
  const supabase = await createClient();

  // Fetch trip data
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (tripError || !trip) {
    throw new Error('Trip not found');
  }

  // Fetch flights with segments
  const { data: flightsData } = await supabase
    .from("flights")
    .select(`
      *,
      flight_segments (*)
    `)
    .eq("trip_id", tripId)
    .order("created_at");

  const flights = flightsData || [];

  // Fetch lodging
  const { data: lodgingData } = await supabase
    .from("lodging")
    .select("*")
    .eq("trip_id", tripId)
    .order("check_in");

  const lodging = lodgingData || [];

  // Fetch participants with user info
  const { data: participantsData } = await supabase
    .from("trip_participants")
    .select(`
      *,
      user:user_id (id, email)
    `)
    .eq("trip_id", tripId)
    .order("created_at");

  const participants = participantsData || [];

  // Calculate cost breakdown
  const flightsCost = flights.reduce((sum, flight) => {
    if (flight.total_price === null || flight.total_price === undefined) {
      return sum;
    }
    const price = typeof flight.total_price === 'number' ? flight.total_price : 
                 typeof flight.total_price === 'string' ? parseFloat(flight.total_price) || 0 : 0;
    return sum + price;
  }, 0);
  
  const lodgingCost = lodging.reduce((sum, lodge) => {
    if (lodge.total_cost === null || lodge.total_cost === undefined) {
      return sum;
    }
    const price = typeof lodge.total_cost === 'number' ? lodge.total_cost : 
                 typeof lodge.total_cost === 'string' ? parseFloat(lodge.total_cost) || 0 : 0;
    return sum + price;
  }, 0);

  return {
    trip,
    flights,
    lodging,
    participants,
    costBreakdown: {
      flights: flightsCost,
      lodging: lodgingCost,
      total: flightsCost + lodgingCost,
    },
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { id: tripId } = await params;

  try {
    const tripData = await getTripData(tripId);
    const { trip, flights, lodging, participants, costBreakdown } = tripData;

    // Get host email for display
    const hostParticipant = participants.find(p => p.user_id === trip.host_id);
    const hostEmail = hostParticipant?.user.email;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <TripHeader trip={trip} hostEmail={hostEmail} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Flight Timeline */}
              <FlightTimeline flights={flights} />

              {/* Lodging Details */}
              <LodgingDetails lodging={lodging} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Cost Breakdown */}
              <CostBreakdown
                flights={costBreakdown.flights}
                lodging={costBreakdown.lodging}
                total={costBreakdown.total}
              />

              {/* Participants */}
              <ParticipantList participants={participants} trip={trip} />
            </div>
          </div>

          {/* Empty State - when no data */}
          {flights.length === 0 && lodging.length === 0 && (
            <div className="mt-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Trip Created Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your trip is ready. Add flight and lodging links to see your complete itinerary.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>• Flight links will be parsed for routes and costs</p>
                    <p>• Lodging links will show accommodation details</p>
                    <p>• All costs will be automatically calculated</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading trip:', error);
    notFound();
  }
} 