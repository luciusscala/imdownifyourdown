import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    // Get Supabase user
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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch trip details
    const { data: trip, error: tripError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Fetch flights for this trip
    const { data: flights, error: flightsError } = await supabase
      .from("flights")
      .select("*")
      .eq("plan_id", tripId);

    if (flightsError) {
      return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
    }

    // Fetch lodging for this trip
    const { data: lodging, error: lodgingError } = await supabase
      .from("lodging")
      .select("*")
      .eq("plan_id", tripId);

    if (lodgingError) {
      return NextResponse.json({ error: "Failed to fetch lodging" }, { status: 500 });
    }

    // Fetch participants for this trip
    const { data: participants, error: participantsError } = await supabase
      .from("participants")
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          full_name
        )
      `)
      .eq("plan_id", tripId);

    if (participantsError) {
      return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
    }

    return NextResponse.json({
      trip,
      flights: flights || [],
      lodging: lodging || [],
      participants: participants || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}