import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

// Request validation schema
const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(100, "Title must be less than 100 characters"),
  flightLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  lodgingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Types
interface FastAPIResponse {
  status: "success" | "error";
  message?: string;
  data?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = createTripSchema.parse(body);
    
    console.log("Creating trip with data:", {
      title: validatedData.title,
      hasFlightLink: !!validatedData.flightLink,
      hasLodgingLink: !!validatedData.lodgingLink,
    });

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

    // Authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Authentication failed:", userError);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Step 1: Create trip in Supabase
    console.log("Creating trip in Supabase...");
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert([{
        host_id: user.id,
        title: validatedData.title,
      }])
      .select("id")
      .single();

    if (tripError || !trip) {
      console.error("Failed to create trip in Supabase:", tripError);
      throw new Error(tripError?.message || "Failed to create trip");
    }

    console.log("Trip created successfully with ID:", trip.id);

    // Step 2: Add host as participant
    console.log("Adding host as participant...");
    const { error: participantError } = await supabase
      .from("trip_participants")
      .insert([{
        trip_id: trip.id,
        user_id: user.id,
      }]);

    if (participantError) {
      console.error("Failed to add host as participant:", participantError);
      // Don't throw error here - trip was created successfully
      // Just log the issue for debugging
    } else {
      console.log("Host added as participant successfully");
    }

    // Step 3: Send links to FastAPI for parsing (non-blocking)
    const fastApiPromises: Promise<FastAPIResponse>[] = [];
    const fastApiBaseUrl = process.env.FASTAPI_SERVER_URL;

    if (!fastApiBaseUrl) {
      console.warn("FASTAPI_SERVER_URL not configured, skipping link parsing");
    } else {
      // Parse flight link if provided
      if (validatedData.flightLink) {
        console.log("Sending flight link to FastAPI for parsing...");
        fastApiPromises.push(
          parseFlightLink(fastApiBaseUrl, trip.id, validatedData.flightLink)
        );
      }

      // Parse lodging link if provided
      if (validatedData.lodgingLink) {
        console.log("Sending lodging link to FastAPI for parsing...");
        fastApiPromises.push(
          parseLodgingLink(fastApiBaseUrl, trip.id, validatedData.lodgingLink)
        );
      }
    }

    // Step 4: Handle FastAPI responses in background (don't block user)
    if (fastApiPromises.length > 0) {
      Promise.allSettled(fastApiPromises).then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            console.log(`FastAPI parsing ${index + 1} completed:`, result.value);
          } else {
            console.error(`FastAPI parsing ${index + 1} failed:`, result.reason);
          }
        });
      });
    }

    // Step 5: Return success immediately
    return NextResponse.json(
      { 
        tripId: trip.id,
        message: "Trip created successfully. Parsing links in background."
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Trip creation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Helper function to parse flight links via FastAPI
async function parseFlightLink(
  baseUrl: string,
  tripId: string,
  flightLink: string
): Promise<FastAPIResponse> {
  try {
    const response = await fetch(`${baseUrl}/api/parse_and_insert_flight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trip_id: tripId,
        link: flightLink,
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }

    const data = await response.json();
    return { status: "success", data };
  } catch (error) {
    console.error("Flight parsing failed:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

// Helper function to parse lodging links via FastAPI
async function parseLodgingLink(
  baseUrl: string,
  tripId: string,
  lodgingLink: string
): Promise<FastAPIResponse> {
  try {
    const response = await fetch(`${baseUrl}/api/parse_and_insert_lodge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trip_id: tripId,
        link: lodgingLink,
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }

    const data = await response.json();
    return { status: "success", data };
  } catch (error) {
    console.error("Lodging parsing failed:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
