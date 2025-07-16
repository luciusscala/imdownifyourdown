import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: planId } = await params;

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

    // Fetch plan details
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Fetch flights for this plan
    const { data: flights, error: flightsError } = await supabase
      .from("flights")
      .select("*")
      .eq("plan_id", planId);

    if (flightsError) {
      return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
    }

    // Fetch lodging for this plan
    const { data: lodging, error: lodgingError } = await supabase
      .from("lodging")
      .select("*")
      .eq("plan_id", planId);

    if (lodgingError) {
      return NextResponse.json({ error: "Failed to fetch lodging" }, { status: 500 });
    }

    // Fetch participants for this plan
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
      .eq("plan_id", planId);

    if (participantsError) {
      return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
    }

    return NextResponse.json({
      plan,
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