import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface ApiError {
  error: string;
}

interface MeetingRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  { params }: MeetingRouteContext,
): Promise<NextResponse<SacramentMeeting | ApiError>> {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "The meeting id must be a number." },
      { status: 400 },
    );
  }

  const meeting = getMeetingById(Number(id));
  if (!meeting) {
    return NextResponse.json(
      { error: "Meeting not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(meeting);
}
