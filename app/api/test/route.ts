import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    // Insert a test row with arbitrary data
    const { data, error } = await supabase
      .from("test_table")
      .insert([{ value: "hello world", created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
} 