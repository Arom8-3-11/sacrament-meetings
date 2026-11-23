# Sacrament Meeting Planner

A Next.js application for reviewing and printing Headwaters YSA Branch meeting
programs. Meeting data is stored in a temporary in-memory module and includes
the current Sunday plus four previous Sundays.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — planner landing page
- `/meetings` — current and past meeting programs
- `/meetings/current` — redirects to this Sunday's program
- `/meetings/[id]` — meeting agenda with a print action

## API

- `GET /api/meetings` — list meetings
- `GET /api/meetings?date=YYYY-MM-DD` — filter meetings by date
- `GET /api/meetings/[id]` — read a meeting by numeric ID

The collection endpoint returns `400` for an invalid date. The item endpoint
returns `400` for a non-numeric ID and `404` when a numeric ID is not found.

## Checks

```bash
npm run lint
npm run build
```

The branch presidency is listed in `lib/branch.ts`. The meeting records are
sample data: their announcements, assignments, and other details are not
confirmed. The list includes the current Sunday and four previous Sundays.
Each ID is derived from its meeting date, and its sample agenda is selected
deterministically, so a program's URL and details do not change as weeks pass.
The records are still generated in memory and are not persistent; programs
older than the five-week window are not retained. The `wardBusiness` data field
is displayed as "Branch business" in the program. Database storage and meeting
mutations are outside this week's assignment scope.
