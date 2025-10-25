import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("jf_events")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ valid: Boolean(data) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
