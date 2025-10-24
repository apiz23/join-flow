import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing event token" }, { status: 400 });
  }

  const { data: event, error: eventError } = await supabase
    .from("jf_events")
    .select("id")
    .eq("ajk_token", token)
    .single();

  if (eventError || !event) {
    return NextResponse.json(
      { error: "Event tidak dijumpai" },
      { status: 404 },
    );
  }

  const { data: ajkList, error: ajkError } = await supabase
    .from("jf_ajk_list")
    .select("id, name, max_members")
    .eq("event_id", event.id);

  if (ajkError) {
    return NextResponse.json({ error: ajkError.message }, { status: 500 });
  }

  const { data: registrations, error: regError } = await supabase
    .from("jf_registrations")
    .select("jf_ajk_id")
    .eq("jf_event_id", event.id);

  if (regError) {
    return NextResponse.json({ error: regError.message }, { status: 500 });
  }

  const ajkCounts: Record<string, number> = {};
  registrations?.forEach((r) => {
    if (r.jf_ajk_id) {
      ajkCounts[r.jf_ajk_id] = (ajkCounts[r.jf_ajk_id] || 0) + 1;
    }
  });

  const ajkWithAvailable = ajkList.map((ajk) => ({
    ...ajk,
    available_members: ajk.max_members - (ajkCounts[ajk.id] || 0),
  }));

  return NextResponse.json({ data: ajkWithAvailable });
}
