import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { TripResponse } from "@/lib/types/trip";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    // Get Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // Fetch trip data
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
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

    const response: TripResponse = {
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

    return NextResponse.json(response);

  } catch (error) {
    console.error("Trip fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}