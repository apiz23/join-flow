import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, matric_no, email, phone, committee } = await req.json();

    if (!name || !matric_no || !email || !phone || !committee) {
      return NextResponse.json(
        { error: "Sila lengkapkan semua ruangan." },
        { status: 400 },
      );
    }

    const token = req.headers.get("x-event-token");
    if (!token) {
      return NextResponse.json(
        { error: "Token acara tidak dijumpai." },
        { status: 400 },
      );
    }

    const { data: event, error: eventError } = await supabase
      .from("jf_events")
      .select("id, group_link, name")
      .eq("token", token)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Acara tidak sah atau tidak dijumpai." },
        { status: 404 },
      );
    }

    // ✅ Validate AJK list
    const { data: ajk, error: ajkError } = await supabase
      .from("jf_ajk_list")
      .select("id, max_members")
      .eq("id", committee)
      .eq("event_id", event.id)
      .single();

    if (ajkError || !ajk) {
      return NextResponse.json(
        { error: "Jawatankuasa tidak sah untuk acara ini." },
        { status: 400 },
      );
    }

    const { count, error: countError } = await supabase
      .from("jf_registrations")
      .select("*", { count: "exact", head: true })
      .eq("jf_ajk_id", ajk.id)
      .eq("jf_event_id", event.id);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const currentCount = count ?? 0;
    if (currentCount >= ajk.max_members) {
      return NextResponse.json(
        { error: "Jawatankuasa ini telah penuh." },
        { status: 400 },
      );
    }

    const { data: existing, error: dupError } = await supabase
      .from("jf_registrations")
      .select("id")
      .eq("matric_no", matric_no)
      .eq("jf_event_id", event.id)
      .maybeSingle();

    if (dupError) {
      return NextResponse.json({ error: dupError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { error: "Anda telah berdaftar untuk acara ini." },
        { status: 400 },
      );
    }

    const { error: insertError } = await supabase
      .from("jf_registrations")
      .insert({
        id: uuidv4(),
        name,
        matric_no,
        email,
        phone,
        jf_ajk_id: ajk.id,
        jf_event_id: event.id,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Pendaftaran berjaya! Terima kasih atas penyertaan anda.",
      group_link: event.group_link || null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Ralat sistem. Sila cuba lagi." },
      { status: 500 },
    );
  }
}
