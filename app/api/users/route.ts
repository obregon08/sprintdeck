import { NextResponse } from "next/server";
import { userServices } from "@/services/users";

export async function GET() {
  try {
    const users = await userServices.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 