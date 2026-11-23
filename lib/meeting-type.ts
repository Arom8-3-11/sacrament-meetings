import type { MeetingType } from "@/lib/types";

export function hasIntermediateHymn(meetingType: MeetingType): boolean {
  return (
    meetingType === "regular" ||
    meetingType === "stake" ||
    meetingType === "general"
  );
}
