# field-event-lp-template

Guest page template for Cresta field events (dinners, roundtables). Static HTML/CSS/JS — no build step.

## New event

1. Edit `event.js` — title, date/venue details, hosts, guests, contact email.
2. Add headshots to `assets/photos/` and reference them via each person's `photo` field. Empty `photo` shows a grey placeholder.
3. Set `showHosts: false` to hide the hosts band.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Deployed on Vercel (Framework Preset: Other); every push to `main` redeploys. The page sets `noindex` since guest lists shouldn't be searchable.

## Clay sync

Guests and hosts can be pushed live from a Clay table. The page loads them from `/api/guests` and falls back to `event.js` when the API returns nothing.

**One-time Vercel setup**
1. Project → Storage → Create → **Blob** → connect it to this project (adds `BLOB_READ_WRITE_TOKEN`).
2. Project → Settings → Environment Variables → add `CLAY_WEBHOOK_SECRET` (any long random string).
3. Redeploy.

**Clay HTTP API column**
- Method `POST`, URL `https://<your-domain>/api/guests`
- Header `x-api-key: <CLAY_WEBHOOK_SECRET>`, `Content-Type: application/json`
- Body:
  ```json
  {
    "name": "{{Name}}",
    "title": "{{Title}}",
    "company": "{{Org}}",
    "linkedin_url": "{{LinkedIn Profile URL}}",
    "photo_url": "{{LinkedIn Photo}}"
  }
  ```

Optional fields: `"type": "host"` (shows in the hosts band), `"order": 1` (sort position; otherwise alphabetical), `"remove": true` (deletes that person).
People are matched by LinkedIn handle (or name + company), so re-running a row updates it instead of duplicating. Photos are copied into Blob storage since LinkedIn image links expire.
