import { NextResponse } from "next/server";
import { getMeetings, isValidIsoDate } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface ApiError {
  error: string;
}

export function GET(request: Request): NextResponse<SacramentMeeting[] | ApiError> {
  const date = new URL(request.url).searchParams.get("date");

  if (date !== null && !isValidIsoDate(date)) {
    return NextResponse.json(
      { error: "The date query parameter must use YYYY-MM-DD format." },
      { status: 400 },
    );
  }

  return NextResponse.json(getMeetings(date ?? undefined));
}
