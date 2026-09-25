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

Works as-is on GitHub Pages (Settings → Pages → deploy from `main`, root). The page sets `noindex` since guest lists shouldn't be searchable.
