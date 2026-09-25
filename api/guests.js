// Guest data endpoint.
//   GET  /api/guests  → { guests: [...], hosts: [...] } for the page
//   POST /api/guests  → upsert one person from Clay (requires x-api-key header)
//
// Each person is stored as its own JSON blob (people/<id>.json) so Clay can
// send many rows in parallel without overwriting each other. LinkedIn photos
// are copied into Blob storage because LinkedIn CDN links expire.
import { put, list, del } from '@vercel/blob';
import { createHash } from 'node:crypto';

const PREFIX = 'people/';
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });

const str = (v) => (v == null ? '' : String(v).trim());

// Stable id: LinkedIn handle when available, otherwise name + company.
function personId(p) {
  const handle = str(p.linkedin_url).match(/linkedin\.com\/in\/([^/?#]+)/i);
  const basis = handle ? handle[1].toLowerCase() : `${str(p.name)}|${str(p.company)}`.toLowerCase();
  return createHash('sha1').update(basis).digest('hex').slice(0, 16);
}

async function copyPhoto(id, url) {
  if (!/^https?:\/\//i.test(url)) return '';
  try {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.startsWith('image/')) return '';
    const bytes = await res.arrayBuffer();
    if (bytes.byteLength > MAX_PHOTO_BYTES) return '';
    const blob = await put(`photos/${id}`, bytes, {
      access: 'public',
      contentType: type,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return `${blob.url}?v=${Date.now()}`;
  } catch {
    return '';
  }
}

async function readPerson(blob) {
  // Cache-bust with uploadedAt so overwritten records aren't served stale.
  return fetch(`${blob.url}?v=${new Date(blob.uploadedAt).getTime()}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
}

async function existingPhoto(pathname) {
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  const match = blobs.find((b) => b.pathname === pathname);
  return (match && (await readPerson(match)))?.photo || '';
}

function authorized(request) {
  const secret = process.env.CLAY_WEBHOOK_SECRET;
  return Boolean(secret) && request.headers.get('x-api-key') === secret;
}

export async function POST(request) {
  if (!authorized(request)) return json({ error: 'unauthorized' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }

  const name = str(body.name);
  if (!name) return json({ error: '"name" is required' }, 400);

  const id = personId(body);
  const pathname = `${PREFIX}${id}.json`;

  if (body.remove === true || str(body.remove).toLowerCase() === 'true') {
    await del([pathname, `photos/${id}`]).catch(() => {});
    return json({ ok: true, id, removed: true });
  }

  // Keep the stored photo when a row is re-sent without a (working) photo URL.
  const photo = (await copyPhoto(id, str(body.photo_url))) || (await existingPhoto(pathname));

  const person = {
    id,
    type: str(body.type).toLowerCase() === 'host' ? 'host' : 'guest',
    name,
    title: str(body.title),
    company: str(body.company),
    linkedin_url: str(body.linkedin_url),
    photo,
    order: Number.isFinite(Number(body.order)) && str(body.order) !== '' ? Number(body.order) : null,
    updatedAt: new Date().toISOString(),
  };

  await put(pathname, JSON.stringify(person), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });

  return json({ ok: true, id, photo: Boolean(person.photo) });
}

export async function GET() {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const people = (await Promise.all(blobs.map(readPerson))).filter(Boolean);

  people.sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name)
  );

  const pick = ({ name, title, company, photo, linkedin_url }) => ({
    name,
    title,
    company,
    photo,
    linkedin_url: /^https?:\/\//i.test(linkedin_url || '') ? linkedin_url : '',
  });
  return json(
    {
      guests: people.filter((p) => p.type === 'guest').map(pick),
      hosts: people.filter((p) => p.type === 'host').map(pick),
    },
    200,
    { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=300' }
  );
}
