# Sacrament Meeting Planner

A Next.js application for reviewing and printing Headwaters YSA Branch meeting
programs. Meeting data is stored in a Neon PostgreSQL database.

## Run locally

```bash
npm install
npm run dev
```

Set `DATABASE_URL` in `.env.local` to a Neon PostgreSQL connection string.
Apply `database/migrations/001-add-intermediate-hymn.sql` to an existing
meetings database before using this version of the app.

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — planner landing page
- `/meetings` — current and past meeting programs
- `/meetings/current` — redirects to this Sunday's program
- `/meetings/[id]` — meeting agenda with a print action
- `/meetings/new` — create a meeting
- `/meetings/[id]/edit` — edit a meeting

The leader tools and mutation actions are not yet protected by authentication.

## API

- `GET /api/meetings` — list meetings
- `GET /api/meetings?date=YYYY-MM-DD` — filter meetings by date
- `GET /api/meetings/[id]` — read a meeting by numeric ID

The collection endpoint returns `400` for an invalid date. The item endpoint
returns `400` for a non-numeric ID and `404` when a numeric ID is not found.

Regular, stake, and general programs include an intermediate hymn between
speakers. Existing programs without an assigned intermediate hymn show
"Not yet assigned"; edit the program to select one.

## Checks

```bash
npm run lint
npm run build
```

The branch presidency is listed in `lib/branch.ts`. The meeting records are
sample data: their announcements, assignments, and other details are not
confirmed. The `wardBusiness` data field is displayed as "Branch business"
in the program.
