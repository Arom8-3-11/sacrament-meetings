import { branchName, branchPresident } from "@/lib/branch";
import {
  formatIsoDate,
  getCurrentSundayDate,
  getMeetingIdForDate,
} from "@/lib/meeting-date";
import type { SacramentMeeting } from "@/lib/types";

type MeetingTemplate = Omit<SacramentMeeting, "id" | "date">;

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

function createMeetings(): SacramentMeeting[] {
  const currentSunday = new Date(`${getCurrentSundayDate()}T12:00:00`);
  const dates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(currentSunday);
    date.setDate(date.getDate() - index * 7);
    return formatIsoDate(date);
  });

  const templates: MeetingTemplate[] = [
    {
      meetingType: "regular",
      presiding: `President ${branchPresident}`,
      conducting: "To be announced",
      announcements: [
        "Branch temple night is Thursday at 6:30 p.m.",
        "Please bring pantry donations for the community food drive.",
      ],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Sister Olivia Bennett",
      wardBusiness: [
        { description: "Sustain members called to serve in the branch." },
        { description: "Welcome new branch members." },
      ],
      stakeBusiness: false,
      sacramentHymn: { number: 181, title: "Jesus of Nazareth, Savior and King" },
      speakers: [
        {
          name: "Sister Maya Thompson",
          topic: "Remembering our covenants",
          type: "speaker",
        },
        {
          name: "Brother Ethan Brooks",
          topic: "Serving one another",
          type: "speaker",
        },
      ],
      closingHymn: { number: 301, title: "I Am a Child of God" },
      closingPrayer: "Brother Noah Reed",
    },
    {
      meetingType: "testimony",
      presiding: `President ${branchPresident}`,
      conducting: "To be announced",
      announcements: ["Branch temple trip registration closes Wednesday."],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Brother Liam Foster",
      wardBusiness: [],
      stakeBusiness: false,
      sacramentHymn: { number: 195, title: "How Great the Wisdom and the Love" },
      speakers: [],
      closingHymn: { number: 100, title: "Nearer, Dear Savior, to Thee" },
      closingPrayer: "Sister Hannah Price",
    },
    {
      meetingType: "regular",
      presiding: `President ${branchPresident}`,
      conducting: "To be announced",
      announcements: [
        "The branch choir rehearses after the second-hour meetings.",
      ],
      openingHymn: { number: 81, title: "Press Forward, Saints" },
      openingPrayer: "Sister Ava James",
      wardBusiness: [{ description: "Release and sustain the branch music chair." }],
      stakeBusiness: true,
      sacramentHymn: { number: 175, title: "O God, the Eternal Father" },
      speakers: [
        {
          name: `${branchName} Choir`,
          topic: "Come, Thou Fount of Every Blessing",
          type: "musical-number",
        },
        {
          name: "Sister Emily Clark",
          topic: "Finding peace through Christ",
          type: "speaker",
        },
      ],
      closingHymn: { number: 220, title: "Lord, I Would Follow Thee" },
      closingPrayer: "Brother Lucas Hill",
    },
    {
      meetingType: "stake",
      presiding: "President Samuel Lee",
      conducting: "President Samuel Lee",
      announcements: ["Stake conference will be held next month."],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Sister Nora Evans",
      wardBusiness: [],
      stakeBusiness: true,
      sacramentHymn: { number: 193, title: "I Stand All Amazed" },
      speakers: [
        {
          name: "President Samuel Lee",
          topic: "Strengthening families",
          type: "speaker",
        },
      ],
      closingHymn: { number: 266, title: "The Time Is Far Spent" },
      closingPrayer: "Elder Peter Young",
    },
    {
      meetingType: "general",
      presiding: "President Samuel Lee",
      conducting: "Sister Rachel Green",
      announcements: ["All are welcome to the stake devotional."],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Brother Owen Scott",
      wardBusiness: [],
      stakeBusiness: true,
      sacramentHymn: { number: 193, title: "I Stand All Amazed" },
      speakers: [
        {
          name: "Stake Young Women",
          topic: "I Will Walk with Jesus",
          type: "musical-number",
        },
        {
          name: "Sister Rachel Green",
          topic: "A life centered on the Savior",
          type: "speaker",
        },
      ],
      closingHymn: { number: 100, title: "Nearer, Dear Savior, to Thee" },
      closingPrayer: "Brother Isaac Ward",
    },
  ];

  const sundayEpoch = Date.UTC(1970, 0, 4);
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

  return dates.map((date) => {
    const weekNumber = Math.floor(
      (Date.parse(`${date}T00:00:00.000Z`) - sundayEpoch) /
        millisecondsPerWeek,
    );
    const templateIndex =
      ((weekNumber % templates.length) + templates.length) % templates.length;

    return {
      ...templates[templateIndex],
      id: getMeetingIdForDate(date),
      date,
    };
  });
}

export function getMeetings(date?: string): SacramentMeeting[] {
  const meetings = createMeetings();
  const filteredMeetings = date
    ? meetings.filter((meeting) => meeting.date === date)
    : meetings;

  return filteredMeetings.sort((first, second) =>
    second.date.localeCompare(first.date),
  );
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return createMeetings().find((meeting) => meeting.id === id);
}

export function getCurrentMeeting(): SacramentMeeting | undefined {
  const currentDate = getCurrentSundayDate();
  return getMeetings(currentDate)[0];
}
