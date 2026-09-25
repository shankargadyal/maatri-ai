# MAATRI build roadmap

## Phase 1 — Foundation (in progress)
- [ ] Full database schema + RLS + grants + private storage buckets
- [ ] Design system (warm ivory / sage / forest / gold / terracotta), logo asset, PWA manifest
- [ ] Auth: email/password, roles (patient/caregiver/doctor), session, logout, profile bootstrap
- [ ] Patient app shell: bottom nav (Home, Medications, Appointments, Care, Profile)
- [ ] Home: next dose, care thread, today's progress, next appointment
- [ ] Dose confirmation (real records) + adherence views/charts
- [ ] Prescription upload (image/PDF) → AI extraction → review → version → schedule engine
- [ ] Medicine verification via camera + AI label analysis, mismatch blocks confirmation
- [ ] MAATRI AI assistant with real server-side tool calling
- [ ] i18n (English / Kannada / Hindi), accessibility settings

## Phase 2 — Care network
- [ ] Caregiver invite + consent + granular permissions + revoke
- [ ] Caregiver dashboard, call/message caregiver
- [ ] Escalation engine (deterministic levels 0-4) + follow-ups + caregiver alerts
- [ ] Notification center, preferences, web push + service worker
- [ ] Appointments + reminders (7d/1d/same day) + post-visit prescription prompt

## Phase 3 — Doctor, comparison, ops
- [ ] Prescription V(n) comparison (new/removed/changed/unchanged) + activation archiving
- [ ] Doctor view (plan, versions, adherence, events)
- [ ] Audit log / activity history / security events
- [ ] Passkeys (WebAuthn) enrollment + login
- [ ] Scheduled jobs (occurrence generation, follow-ups, escalation, appointment reminders)
- [ ] Demo data (Lakshmi / Priya / Dr. Ananya Rao), README, tests, browser walkthrough

## Round 2 (requested)
- [x] Compact login, Google sign-in, no email links
- [x] Fingerprint unlock after first sign-in
- [x] One-tap "Taken" reminders, 10-min heads-up, spoken "did you take it?" follow-up
- [x] Duplicate / too-early dose guard + "I took an extra tablet" report
- [ ] Automatic caretaker SMS + call on missed dose (deferred by user — needs phone service)
- [ ] Background push when app is closed (server push keys)
- [x] Better prescription reading incl. PDFs
- [ ] Android package for Play Store (on hold by user)
- [x] PDF prescriptions + Indian dosage notation (1-0-1, BD, TDS, SOS, AC/PC)
- [x] Server missed-dose check every 5 min: +30 follow-up, +60 missed → caregiver alert

## Round 3 (approved plan)
- [x] Caregiver invite accept/decline, phone field, call caregiver button
- [x] Caregiver home screen (live doses, streak, alerts, I've checked)
- [x] Closed-phone push (patient reminders, ringing caregiver alert)
- [x] Refill warnings (stock, per-dose, 5-day alert)
- [x] Doctor report page + PDF
- [x] Missed-dose advice card
- [x] Streaks + gentle praise
- [ ] Paid automatic phone call (Twilio) — deferred, costs money

## Round 4
- [x] Twilio caregiver call + text fallback + retry after 10 min
- [x] Stronger medicine photo check
- [x] Offline dose confirmations with later sync
- [x] Send test reminder button
- [ ] Twilio trial phone number (waiting on user)
- [ ] Real Android closed-phone test (needs publish + a real phone)

## Round 5
- [x] After-visit check: "Did you visit?" → "New prescription or same?" (home, appointments, push)
- [ ] Blister Ledger strip-count proof of dose (plan ready, not built yet)
