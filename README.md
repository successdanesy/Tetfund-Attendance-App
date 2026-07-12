# TETFUND Staff Attendance

A PWA that replaces TETFUND's paper attendance book. Staff clock in daily with
a live photo and their GPS location, checked against an office geofence. Admins
review submissions and export data.

Backend is serverless (Next.js route handlers on Vercel) with **MongoDB Atlas**
as the database. Photos are downscaled in the browser and stored as compressed
base64 inside the document, so it stays Vercel + MongoDB only, no extra storage
service. Auth is lightweight: passwords are hashed with bcrypt and checked on
the server; the signed-in user is remembered on the device.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=tetfund
   ```
3. In **Atlas → Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
   Vercel's serverless functions use dynamic IPs, so a fixed allowlist won't
   work for the deployed app. The database stays protected by its username and
   password. Without this you'll see a TLS handshake error on connect.
4. Run it:
   ```bash
   npm run dev        # http://localhost:3000
   ```

Use **Chrome on `localhost`** (or an HTTPS URL such as your Vercel deployment) -
the camera and location APIs only work in a secure context.

The first request seeds the database automatically: 5 departments and one admin
(`admin@tetfund.gov.ng` / `admin`). No staff or attendance to start.

## Deploying to Vercel

Add the same variables under **Project Settings > Environment Variables**:

- `MONGODB_URI` - your Atlas connection string
- `MONGODB_DB` - `tetfund`

Redeploy after adding them. The Vercel URL is HTTPS, so camera + GPS work on a
phone there with no extra setup.

## Live demo script

1. **Sign up** - from the welcome screen, tap *Create account* and walk the
   5-step wizard: work email (try a `@gmail.com` address first to show it being
   rejected), name, department, password, and a reference selfie. Ends on
   *Account created - pending approval*.
2. **Admin approves** - tap *Administrator sign in* (`admin@tetfund.gov.ng` /
   `admin`) and approve the new account under *Approvals*. Because data is now
   persisted, you can sign up on a phone and watch it appear in admin on a
   laptop live.
3. **Clock in** - sign in as the staff member. On the clock-in screen, tap
   *Simulate office location (demo)* so the geofence passes wherever you're
   presenting (the real office is in Maitama, Abuja). Take the photo, submit,
   and watch the **present stamp** draw itself in.
   - To show the block path, tap *Check my location* from outside the 150 m
     geofence.
4. **Admin review + export** - in admin, open *Today*, click a row to see the
   clock-in photo beside the reference photo for a manual identity check, and
   hit *Download CSV*.
5. **Reset for the next pitch** - on the *Approvals* screen, *Reset demo data*
   clears all staff and attendance and re-seeds, so every run starts clean.

## Structure

- `lib/mongodb.ts` - serverless-cached Atlas connection.
- `lib/db.ts` - data access, seeding, and server-side validation
  (`server-only`).
- `app/api/*` - route handlers (serverless functions): auth, staff, attendance,
  departments, reset.
- `lib/api.ts` - typed client fetch wrappers.
- `lib/session.tsx` - client session (localStorage), guarded by `lib/guards.ts`.
- `components/` - design-system primitives, camera capture, and the stamp.
- Design tokens live in `app/globals.css` (`@theme`) - everything consumes them.

## What's still mock / out of scope

Real session cookies, email verification, reverse geocoding, automated
face-matching, and WiFi/IP restriction are out of scope for the demo. GPS
geofence is the real gate; identity is a manual side-by-side admin check.
