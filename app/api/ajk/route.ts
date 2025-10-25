import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing event token" }, { status: 400 });
  }

  const { data: event, error: eventError } = await supabase
    .from("jf_events")
    .select("*")
    .eq("token", token)
    .single();

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
    .select("*")
    .eq("jf_event_id", event.id);

  if (regError) {
    return NextResponse.json({ error: regError.message }, { status: 500 });
  }

  const ajkWithDetails = ajkList.map((ajk) => {
    const ajkRegistrations = registrations.filter(
      (r) => r.jf_ajk_id === ajk.id,
    );

    return {
      ...ajk,
      available_members: ajk.max_members - ajkRegistrations.length,
      registrations: ajkRegistrations,
    };
  });

  return NextResponse.json({
    data: ajkWithDetails,
    event: {
      name: event.name,
      group_link: event.group_link,
    },
  });
}
