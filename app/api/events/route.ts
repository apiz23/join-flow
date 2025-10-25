import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId)
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

  const { data, error } = await supabase
    .from("jf_events")
    .select("*")
    .eq("created_by", userId)
    .order("start_date", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, start_date, end_date, created_by, ajk_list } =
    body;

  if (!name || !start_date || !end_date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const eventId = uuidv4();

  const { data: eventData, error: eventError } = await supabase
    .from("jf_events")
    .insert([
      {
        id: eventId,
        name,
        description,
        start_date,
        end_date,
        created_by,
      },
    ])
    .select();

  if (eventError) {
    console.error(eventError);
    return NextResponse.json({ error: eventError.message }, { status: 500 });
  }

  if (ajk_list && Array.isArray(ajk_list) && ajk_list.length > 0) {
    const ajkData = ajk_list.map((ajk: any) => ({
      id: uuidv4(),
      name: ajk.name,
      max_members: parseInt(ajk.max_members, 10),
      event_id: eventId,
    }));

    const { error: ajkError } = await supabase
      .from("jf_ajk_list")
      .insert(ajkData);

    if (ajkError) {
      console.error(ajkError);
      return NextResponse.json(
        { error: "Event created, but failed to add AJK roles" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    {
      message: "Event and AJK roles created successfully",
      event: eventData[0],
    },
    { status: 200 },
  );
}
