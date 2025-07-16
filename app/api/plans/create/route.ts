import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    const body = await req.json();
    const {
      title,
      origin,
      destination,
      departure_date,
      return_date,
      flight_link,
      lodge_link,
    } = body;
    if (!title || !origin || !destination || !departure_date || !return_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Get Supabase user
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

    // 3. Insert new plan into Supabase
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .insert([
        {
          host_id: user.id,
          title,
          origin,
          destination,
          departure_date,
          return_date,
          flight_link,
          lodge_link,
        },
      ])
      .select("id")
      .single();
    if (planError || !plan) {
      throw new Error(planError?.message || "Failed to insert plan");
    }
    const planId = plan.id;

    // 4. Insert dummy flight
    const dummyFlight = {
      plan_id: planId,
      airline: "Test Airline",
      flight_number: "TA123",
      departure_airport: "JFK",
      arrival_airport: "LAX",
      departure_time_utc: new Date().toISOString(),
      arrival_time_utc: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    };
    const { error: flightsError } = await supabase.from("flights").insert([dummyFlight]);
    if (flightsError) {
      throw new Error(flightsError.message || "Failed to insert flights");
    }

    // 5. Insert dummy lodging
    const dummyLodging = {
      plan_id: planId,
      name: "Test Hotel",
      location: "Test City",
      number_of_guests: 2,
      check_in: new Date().toISOString(),
      check_out: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      home_link: "https://example.com",
    };
    const { error: lodgingError } = await supabase.from("lodging").insert([dummyLodging]);
    if (lodgingError) {
      throw new Error(lodgingError.message || "Failed to insert lodging");
    }

    // 6. Return success
    return NextResponse.json({ planId }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 