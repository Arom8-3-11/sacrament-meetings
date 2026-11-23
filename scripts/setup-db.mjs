// One-time database setup: creates the meetings table and seeds sample data.
// Run with: node --env-file=.env.local scripts/setup-db.mjs
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const presidentLine = "President Jon Blanchard";
const firstCounselor = "Brother Aaron Hildreth";
const secondCounselor = "Brother Garrett Golding";

const meetings = [
  {
    date: "2026-09-20",
    meetingType: "regular",
    presiding: presidentLine,
    conducting: firstCounselor,
    announcements: [
      "Branch temple night is Thursday at 6:30 p.m.",
      "Please bring pantry donations for the community food drive.",
    ],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Sister Olivia Bennett",
    wardBusiness: [{ description: "Sustain members called to serve in the branch." }],
    stakeBusiness: false,
    sacramentHymn: { number: 181, title: "Jesus of Nazareth, Savior and King" },
    speakers: [
      { name: "Sister Maya Thompson", topic: "Remembering our covenants", type: "speaker" },
      { name: "Brother Ethan Brooks", topic: "Serving one another", type: "speaker" },
    ],
    closingHymn: { number: 301, title: "I Am a Child of God" },
    closingPrayer: "Brother Noah Reed",
  },
  {
    date: "2026-09-27",
    meetingType: "regular",
    presiding: presidentLine,
    conducting: secondCounselor,
    announcements: ["The branch choir rehearses after the second-hour meetings."],
    openingHymn: { number: 81, title: "Press Forward, Saints" },
    openingPrayer: "Sister Ava James",
    wardBusiness: [{ description: "Release and sustain the branch music chair." }],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: "O God, the Eternal Father" },
    speakers: [
      { name: "Brother Daniel Smith", topic: "Faith in every footstep", type: "speaker" },
      { name: "Sister Emily Clark", topic: "Finding peace through Christ", type: "speaker" },
    ],
    closingHymn: { number: 220, title: "Lord, I Would Follow Thee" },
    closingPrayer: "Brother Lucas Hill",
  },
  {
    date: "2026-10-04",
    meetingType: "general",
    presiding: "President Samuel Lee",
    conducting: "President Samuel Lee",
    announcements: ["General conference will be broadcast in the chapel."],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Brother Owen Scott",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      { name: "Sister Rachel Green", topic: "A life centered on the Savior", type: "speaker" },
    ],
    closingHymn: { number: 100, title: "Nearer, Dear Savior, to Thee" },
    closingPrayer: "Brother Isaac Ward",
  },
  {
    date: "2026-10-11",
    meetingType: "testimony",
    presiding: presidentLine,
    conducting: presidentLine,
    announcements: ["Branch temple trip registration closes Wednesday."],
    openingHymn: { number: 4, title: "Truth Eternal" },
    openingPrayer: "Brother Liam Foster",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 195, title: "How Great the Wisdom and the Love" },
    speakers: [],
    closingHymn: { number: 152, title: "God Be with You Till We Meet Again" },
    closingPrayer: "Sister Hannah Price",
  },
  {
    date: "2026-10-18",
    meetingType: "regular",
    presiding: presidentLine,
    conducting: firstCounselor,
    announcements: ["Sign up for the ministering interviews in the foyer."],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Sister Grace Porter",
    wardBusiness: [{ description: "Welcome new branch members." }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: "Sister Chloe Ramirez", topic: "The power of daily scripture study", type: "speaker" },
      { name: "Headwaters YSA Branch Choir", topic: "Come, Thou Fount of Every Blessing", type: "musical-number" },
      { name: "Brother Caleb Johnson", topic: "Becoming a covenant people", type: "speaker" },
    ],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother Mason Cole",
  },
  {
    date: "2026-10-25",
    meetingType: "stake",
    presiding: "President Samuel Lee",
    conducting: "President Samuel Lee",
    announcements: ["Stake conference adult session is Saturday at 7:00 p.m."],
    openingHymn: { number: 59, title: "Come, O Thou King of Kings" },
    openingPrayer: "Sister Nora Evans",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      { name: "President Samuel Lee", topic: "Strengthening families", type: "speaker" },
      { name: "Elder Peter Young", topic: "The gathering of Israel", type: "speaker" },
    ],
    closingHymn: { number: 266, title: "The Time Is Far Spent" },
    closingPrayer: "Sister Lily Hayes",
  },
  {
    date: "2026-11-01",
    meetingType: "testimony",
    presiding: presidentLine,
    conducting: secondCounselor,
    announcements: ["Daylight saving time ends today — check your clocks."],
    openingHymn: { number: 131, title: "More Holiness Give Me" },
    openingPrayer: "Brother Wyatt Turner",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: "In Humility, Our Savior" },
    speakers: [],
    closingHymn: { number: 98, title: "I Need Thee Every Hour" },
    closingPrayer: "Sister Zoe Mitchell",
  },
  {
    date: "2026-11-08",
    meetingType: "regular",
    presiding: presidentLine,
    conducting: firstCounselor,
    announcements: ["The branch Thanksgiving dinner is Friday, November 20."],
    openingHymn: { number: 142, title: "Sweet Hour of Prayer" },
    openingPrayer: "Sister Abigail Ross",
    wardBusiness: [{ description: "Sustain the new elders quorum instructor." }],
    stakeBusiness: false,
    sacramentHymn: { number: 173, title: "While of These Emblems We Partake" },
    speakers: [
      { name: "Brother Henry Walker", topic: "Gratitude in all things", type: "speaker" },
      { name: "Sister Sofia Martinez", topic: "The blessings of tithing", type: "speaker" },
    ],
    closingHymn: { number: 92, title: "For the Beauty of the Earth" },
    closingPrayer: "Brother Eli Bennett",
  },
  {
    date: "2026-11-15",
    meetingType: "regular",
    presiding: presidentLine,
    conducting: secondCounselor,
    announcements: [
      "Bring a favorite hymn request for next week's special music program.",
      "Youth temple baptisms are this Wednesday after school.",
    ],
    openingHymn: { number: 66, title: "Rejoice, the Lord Is King!" },
    openingPrayer: "Brother Jack Coleman",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 185, title: "Reverently and Meekly Now" },
    speakers: [
      { name: "Sister Natalie Smith", topic: "Hearing Him in everyday life", type: "speaker" },
      { name: "Brother Aiden Price", topic: "The Savior's invitation to follow", type: "speaker" },
    ],
    closingHymn: { number: 223, title: "Have I Done Any Good?" },
    closingPrayer: "Sister Ella Watson",
  },
  {
    date: "2026-11-22",
    meetingType: "special",
    presiding: presidentLine,
    conducting: presidentLine,
    announcements: ["Today's program features musical numbers of thanksgiving."],
    openingHymn: { number: 94, title: "Come, Ye Thankful People" },
    openingPrayer: "Brother Gavin Hughes",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 146, title: "Gently Raise the Sacred Strain" },
    speakers: [
      { name: "Headwaters YSA Branch Choir", topic: "Prayer of Thanksgiving", type: "musical-number" },
      { name: "Sister Brooklyn Adams", topic: "Counting our blessings", type: "speaker" },
      { name: "Primary Children", topic: "Thanks to Our Father", type: "musical-number" },
    ],
    closingHymn: { number: 95, title: "Now Thank We All Our God" },
    closingPrayer: "Brother Miles Foster",
  },
];

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS meetings (
      id             SERIAL        PRIMARY KEY,
      date           DATE          NOT NULL UNIQUE,
      meeting_type   VARCHAR(20)   NOT NULL
                                   CHECK (meeting_type IN
                                     ('testimony','regular','stake','general','special')),
      presiding      VARCHAR(255)  NOT NULL,
      conducting     VARCHAR(255)  NOT NULL,
      announcements  TEXT[]        DEFAULT '{}',
      opening_hymn   JSONB         NOT NULL,
      opening_prayer VARCHAR(255)  NOT NULL,
      ward_business  JSONB         DEFAULT '[]',
      stake_business BOOLEAN       DEFAULT false,
      sacrament_hymn JSONB         NOT NULL,
      speakers       JSONB         DEFAULT '[]',
      closing_hymn   JSONB         NOT NULL,
      closing_prayer VARCHAR(255)  NOT NULL
    )
  `;
  console.log("meetings table is ready.");

  for (const meeting of meetings) {
    await sql`
      INSERT INTO meetings (
        date, meeting_type, presiding, conducting, announcements,
        opening_hymn, opening_prayer, ward_business, stake_business,
        sacrament_hymn, speakers, closing_hymn, closing_prayer
      ) VALUES (
        ${meeting.date},
        ${meeting.meetingType},
        ${meeting.presiding},
        ${meeting.conducting},
        ${meeting.announcements},
        ${JSON.stringify(meeting.openingHymn)}::jsonb,
        ${meeting.openingPrayer},
        ${JSON.stringify(meeting.wardBusiness)}::jsonb,
        ${meeting.stakeBusiness},
        ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
        ${JSON.stringify(meeting.speakers)}::jsonb,
        ${JSON.stringify(meeting.closingHymn)}::jsonb,
        ${meeting.closingPrayer}
      )
      ON CONFLICT (date) DO NOTHING
    `;
  }

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM meetings`;
  console.log(`Seed complete. meetings table now has ${count} rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
