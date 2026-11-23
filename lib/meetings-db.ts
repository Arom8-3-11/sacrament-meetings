import { neon } from "@neondatabase/serverless";
import { getCurrentSundayDate } from "@/lib/meeting-date";
import type {
  Hymn,
  SacramentMeeting,
  SpeakerItem,
  WardBusinessItem,
} from "@/lib/types";

export const MEETINGS_PER_PAGE = 5;

const sql = neon(process.env.DATABASE_URL!);

interface MeetingRow {
  id: number;
  date: string;
  meeting_type: SacramentMeeting["meetingType"];
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[] | null;
  stake_business: boolean | null;
  sacrament_hymn: Hymn;
  intermediate_hymn: Hymn | null;
  speakers: SpeakerItem[] | null;
  closing_hymn: Hymn;
  closing_prayer: string;
}

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn: row.sacrament_hymn,
    intermediateHymn: row.intermediate_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export async function getMeetings(date?: string): Promise<SacramentMeeting[]> {
  const rows = (
    date
      ? await sql`
          SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
                 presiding, conducting, announcements, opening_hymn,
                 opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn,
                 speakers, closing_hymn, closing_prayer
          FROM meetings
          WHERE date = ${date}
          ORDER BY date DESC
        `
      : await sql`
          SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
                 presiding, conducting, announcements, opening_hymn,
                 opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn,
                 speakers, closing_hymn, closing_prayer
          FROM meetings
          ORDER BY date DESC
        `
  ) as MeetingRow[];

  return rows.map(toMeeting);
}

export async function getFilteredMeetings(
  query: string,
  currentPage: number,
): Promise<SacramentMeeting[]> {
  const pattern = `%${query}%`;
  const offset = (currentPage - 1) * MEETINGS_PER_PAGE;

  const rows = (await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
           presiding, conducting, announcements, opening_hymn,
           opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn,
           speakers, closing_hymn, closing_prayer
    FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
            SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
            WHERE speaker->>'name' ILIKE ${pattern}
          )
    ORDER BY date DESC
    LIMIT ${MEETINGS_PER_PAGE} OFFSET ${offset}
  `) as MeetingRow[];

  return rows.map(toMeeting);
}

export async function getMeetingsPageCount(query: string): Promise<number> {
  const pattern = `%${query}%`;

  const [{ count }] = (await sql`
    SELECT COUNT(*)::int AS count
    FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
            SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
            WHERE speaker->>'name' ILIKE ${pattern}
          )
  `) as [{ count: number }];

  return Math.ceil(count / MEETINGS_PER_PAGE);
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | undefined> {
  const rows = (await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
           presiding, conducting, announcements, opening_hymn,
           opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn,
           speakers, closing_hymn, closing_prayer
    FROM meetings
    WHERE id = ${id}
  `) as MeetingRow[];

  return rows[0] ? toMeeting(rows[0]) : undefined;
}

export async function getCurrentMeeting(): Promise<
  SacramentMeeting | undefined
> {
  const meetings = await getMeetings(getCurrentSundayDate());
  return meetings[0];
}

export type MeetingInput = Omit<SacramentMeeting, "id">;

export async function addMeeting(meeting: MeetingInput): Promise<SacramentMeeting> {
  const rows = (await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements, opening_hymn,
      opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn, speakers,
      closing_hymn, closing_prayer
    )
    VALUES (
      ${meeting.date}, ${meeting.meetingType}, ${meeting.presiding},
      ${meeting.conducting},
      ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(meeting.announcements ?? [])}::jsonb)),
      ${JSON.stringify(meeting.openingHymn)}::jsonb, ${meeting.openingPrayer},
      ${JSON.stringify(meeting.wardBusiness)}::jsonb, ${meeting.stakeBusiness},
      ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
      ${meeting.intermediateHymn === null ? null : JSON.stringify(meeting.intermediateHymn)}::jsonb,
      ${JSON.stringify(meeting.speakers)}::jsonb,
      ${JSON.stringify(meeting.closingHymn)}::jsonb, ${meeting.closingPrayer}
    )
    RETURNING id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
              presiding, conducting, announcements, opening_hymn,
              opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn,
              speakers, closing_hymn, closing_prayer
  `) as MeetingRow[];

  if (!rows[0]) {
    throw new Error("The meeting could not be created.");
  }

  return toMeeting(rows[0]);
}

export async function updateMeeting(
  id: number,
  meeting: MeetingInput,
): Promise<SacramentMeeting> {
  const rows = (await sql`
    UPDATE meetings
    SET date = ${meeting.date},
        meeting_type = ${meeting.meetingType},
        presiding = ${meeting.presiding},
        conducting = ${meeting.conducting},
        announcements = ARRAY(
          SELECT jsonb_array_elements_text(${JSON.stringify(meeting.announcements ?? [])}::jsonb)
        ),
        opening_hymn = ${JSON.stringify(meeting.openingHymn)}::jsonb,
        opening_prayer = ${meeting.openingPrayer},
        ward_business = ${JSON.stringify(meeting.wardBusiness)}::jsonb,
        stake_business = ${meeting.stakeBusiness},
        sacrament_hymn = ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
        intermediate_hymn = ${meeting.intermediateHymn === null ? null : JSON.stringify(meeting.intermediateHymn)}::jsonb,
        speakers = ${JSON.stringify(meeting.speakers)}::jsonb,
        closing_hymn = ${JSON.stringify(meeting.closingHymn)}::jsonb,
        closing_prayer = ${meeting.closingPrayer}
    WHERE id = ${id}
    RETURNING id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
              presiding, conducting, announcements, opening_hymn,
              opening_prayer, ward_business, stake_business, sacrament_hymn, intermediate_hymn,
              speakers, closing_hymn, closing_prayer
  `) as MeetingRow[];

  if (!rows[0]) {
    throw new Error("The meeting does not exist.");
  }

  return toMeeting(rows[0]);
}

export async function deleteMeeting(id: number): Promise<void> {
  const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;

  if (rows.length === 0) {
    throw new Error("The meeting does not exist.");
  }
}
