import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();

    const { error } = await supabase.from("jf_users").insert([
      {
        id,
        email,
        password: hashedPassword,
        role: "user",
      },
    ]);

    if (error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "User registered successfully", id },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
