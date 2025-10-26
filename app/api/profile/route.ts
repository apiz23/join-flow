// app/api/profile/route.ts

import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import * as crypto from "crypto";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing session token" },
      { status: 400 },
    );
  }

  const { data: user, error } = await supabase
    .from("jf_users")
    .select("*")
    .eq("id", token)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "User not found or invalid token" },
      { status: 404 },
    );
  }

  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;
  const updatePayload: { email?: string; password?: string } = {};

  if (email) {
    updatePayload.email = email;
  }

  if (password) {
    updatePayload.password = hashPassword(password);
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { error: "No fields provided for update" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("jf_users")
    .update(updatePayload)
    .eq("id", token)
    .select("*") 
    .single();

  if (error || !data) {
    console.error("Supabase update error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ user: data }, { status: 200 });
}
