# iStaff

MVP staffing web app. A coordinator posts events; staff mark interest; the coordinator approves or rejects.

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000 and pick a demo user. Data is stored in `.data/db.json` (set `ISTAFF_DATA_FILE` to move it). Delete that file to reset.

## Test

```
npm test
```

## Built so far

Demo sign-in, post event, The Hub, "I'm interested" with the schedule clash check, applicant review.

Not built yet: My Schedule, Ask, Messages, Profile and certifications, Supabase, real auth.
