# TETFUND Staff Attendance - demo

A PWA that replaces TETFUND's paper attendance book. Staff clock in daily with
a live photo and their GPS location, checked against an office geofence. Admins
review submissions and export data.

This is a **demo**: all data is mock and in-memory. Nothing persists - a page
refresh resets everything back to seed (5 departments, one admin, zero staff,
zero attendance). That reset is deliberate so each pitch starts clean.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Use **Chrome on `localhost`** (or over HTTPS) - the camera and location APIs
only work in a secure context. Allow camera and location when prompted.

## Live demo script

1. **Sign up** - from the welcome screen, tap *Create account* and walk the
   5-step wizard: work email (try a `@gmail.com` address first to show it being
   rejected), name, department, password, and a reference selfie. Ends on
   *Account created - pending approval*.
2. **Admin approves** - go back, tap *Administrator sign in*
   (`admin@tetfund.gov.ng` / `admin`), and approve the new account under
   *Approvals*.
3. **Clock in** - sign in as the staff member. On the clock-in screen, tap
   *Simulate office location (demo)* so the geofence passes wherever you're
   presenting (the real office is in Maitama, Abuja). Take the photo, submit,
   and watch the **present stamp** draw itself in.
   - To show the block path instead, tap *Check my location* from anywhere
     outside the 150 m geofence.
4. **Admin review + export** - back in admin, open *Today*, click a row to see
   the clock-in photo beside the reference photo for a manual identity check,
   and hit *Download CSV*.

## What's mock / out of scope

Real auth, database, email verification, reverse geocoding, automated
face-matching, and WiFi/IP restriction are all out of scope for the demo (see
the build spec). GPS geofence is the real gate; face-matching is a manual
side-by-side check.

## Structure

- `lib/` - types, in-memory store, seed data, email + geofence + CSV logic.
- `components/` - design-system primitives and the stamp animation.
- `app/` - routes (staff: `/`, `/login`, `/signup`, `/home`, `/clock-in`,
  `/history`, `/profile`; admin: `/admin`, `/admin/approvals`,
  `/admin/attendance`).

Design tokens live in `app/globals.css` (`@theme`) - everything consumes them.
