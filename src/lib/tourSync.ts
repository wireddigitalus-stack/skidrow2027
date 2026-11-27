import { TOUR_DATES_2027, type TourDate } from '../data/tour';
import { TOUR_STOPS_GEO, type TourStopGeo } from './geo';

export interface LiveTourShow extends Omit<TourDate, 'country' | 'status'> {
  country: string;
  status: string;
  lat: number | null;
  lng: number | null;
  source: 'bandsintown' | 'fallback';
}

export interface TourSyncResult {
  shows: LiveTourShow[];
  source: 'bandsintown' | 'fallback';
  configured: boolean;
  lastSyncedAt: string | null;
  error: string;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let cachedResult: TourSyncResult | null = null;
let cachedAt = 0;

function getEnv(key: string): string {
  const fromProc = process.env[key];
  const fromImport = (import.meta.env as Record<string, string | undefined>)[key];
  return (fromProc || fromImport || '').trim();
}

export function isBandsintownConfigured(): boolean {
  return Boolean(getEnv('BANDSINTOWN_APP_ID'));
}

const fallbackCoordsById = new Map(TOUR_STOPS_GEO.map((s) => [s.id, { lat: s.lat, lng: s.lng }]));

export function getFallbackTourShows(): LiveTourShow[] {
  return TOUR_DATES_2027.map((d) => ({
    ...d,
    lat: fallbackCoordsById.get(d.id)?.lat ?? null,
    lng: fallbackCoordsById.get(d.id)?.lng ?? null,
    source: 'fallback',
  }));
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function normalizeCountryCode(raw: string): string {
  const v = (raw || '').trim();
  const up = v.toUpperCase();
  if (up === 'UNITED STATES' || up === 'USA' || up === 'US') return 'US';
  if (up === 'CANADA' || up === 'CA') return 'CA';
  if (up === 'UNITED KINGDOM' || up === 'UK' || up === 'GB' || up === 'ENGLAND' || up === 'SCOTLAND') return 'GB';
  if (up === 'GERMANY' || up === 'DE') return 'DE';
  if (up === 'FRANCE' || up === 'FR') return 'FR';
  if (up === 'JAPAN' || up === 'JP') return 'JP';
  if (up === 'BRAZIL' || up === 'BR') return 'BR';
  if (up === 'AUSTRALIA' || up === 'AU') return 'AU';
  if (up === 'MEXICO' || up === 'MX') return 'MX';
  if (up === 'SWEDEN' || up === 'SE') return 'SE';
  if (up === 'NORWAY' || up === 'NO') return 'NO';
  if (up === 'FINLAND' || up === 'FI') return 'FI';
  if (up === 'ITALY' || up === 'IT') return 'IT';
  if (up === 'SPAIN' || up === 'ES') return 'ES';
  if (up === 'NETHERLANDS' || up === 'NL') return 'NL';
  return up.length === 2 ? up : v.slice(0, 12);
}

function mapBandsintownEvent(ev: Record<string, any>): LiveTourShow | null {
  const dtRaw = String(ev.datetime || ev.starts_at || '').trim();
  if (!dtRaw) return null;

  // Parse local YYYY-MM-DD portion cleanly without timezone drift
  const datePart = dtRaw.slice(0, 10);
  const [yStr, mStr, dStr] = datePart.split('-');
  const yNum = Number(yStr);
  const mNum = Number(mStr);
  const dNum = Number(dStr);
  if (!yNum || !mNum || !dNum) return null;

  const utcDate = new Date(Date.UTC(yNum, mNum - 1, dNum));
  const month = MONTHS[mNum - 1] || 'TBA';
  const day = String(dNum).padStart(2, '0');
  const year = String(yNum);
  const weekday = WEEKDAYS[utcDate.getUTCDay()] || 'TBA';

  const venue = ev.venue || {};
  const city = String(venue.city || '').trim() || 'TBA';
  const region = String(venue.region || '').trim();
  const country = normalizeCountryCode(String(venue.country || 'US'));
  const venueName = String(venue.name || ev.title || 'Venue TBA').trim();

  const rawLat = Number(venue.latitude);
  const rawLng = Number(venue.longitude);
  const lat = Number.isFinite(rawLat) && venue.latitude !== '' && venue.latitude != null ? rawLat : null;
  const lng = Number.isFinite(rawLng) && venue.longitude !== '' && venue.longitude != null ? rawLng : null;

  const isFestival = Boolean(
    ev.festival_start_date ||
      ev.festival_end_date ||
      /festival|rockville|sonic temple|louder than life|aftershock|wacken|hellfest|download|monsters of rock/i.test(
        `${venueName} ${ev.title || ''} ${ev.description || ''}`
      )
  );

  const offers: Array<Record<string, any>> = Array.isArray(ev.offers) ? ev.offers : [];
  const ticketOffer =
    offers.find((o) => String(o.type || '').toLowerCase() === 'tickets' && o.url) ||
    offers.find((o) => o.url);

  const isSoldOut = Boolean(
    ev.sold_out ||
      (offers.length > 0 && offers.every((o) => String(o.status || '').toLowerCase() === 'sold out'))
  );

  const ticketUrl = String(ticketOffer?.url || ev.url || 'https://www.bandsintown.com/a/1473-skid-row');
  const slugCity = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    id: `${datePart}-${slugCity || ev.id || 'show'}`,
    isoDate: datePart,
    month,
    day,
    year,
    weekday,
    city,
    region: region || country,
    country,
    venue: venueName,
    kind: isFestival ? 'Festival' : 'Headline',
    status: isSoldOut ? 'Sold Out' : isFestival ? 'Festival Passes' : 'On Sale',
    ticketUrl,
    lat,
    lng,
    source: 'bandsintown',
  };
}

export function toTourStopsGeo(shows: LiveTourShow[]): TourStopGeo[] {
  return shows
    .filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number')
    .map((s) => ({
      id: s.id,
      date: `${s.month} ${s.day}, ${s.year}`,
      city: s.city,
      region: s.region,
      country: s.country || 'US',
      venue: s.venue,
      kind: s.kind,
      lat: s.lat as number,
      lng: s.lng as number,
    }));
}

export function clearTourCache() {
  cachedResult = null;
  cachedAt = 0;
}

export async function getLiveTourSync(opts?: { forceRefresh?: boolean }): Promise<TourSyncResult> {
  const appId = getEnv('BANDSINTOWN_APP_ID');
  const artist = getEnv('BANDSINTOWN_ARTIST') || 'id_1473';
  const now = Date.now();

  if (!opts?.forceRefresh && cachedResult && now - cachedAt < CACHE_TTL_MS) {
    return cachedResult;
  }

  if (!appId) {
    const fallback: TourSyncResult = {
      shows: getFallbackTourShows(),
      source: 'fallback',
      configured: false,
      lastSyncedAt: null,
      error: '',
    };
    cachedResult = fallback;
    cachedAt = now;
    return fallback;
  }

  try {
    const endpoint = `https://rest.bandsintown.com/artists/${encodeURIComponent(artist)}/events?date=upcoming&app_id=${encodeURIComponent(appId)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const errSnippet = (await res.text().catch(() => '')).slice(0, 140);
      throw new Error(`Bandsintown HTTP ${res.status}${errSnippet ? `: ${errSnippet}` : ''}`);
    }

    const raw = await res.json();
    if (!Array.isArray(raw)) {
      throw new Error('Unexpected Bandsintown payload format');
    }

    const mapped = raw
      .map(mapBandsintownEvent)
      .filter((item): item is LiveTourShow => Boolean(item))
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

    if (mapped.length === 0) {
      // Keep verified dates visible if Bandsintown returns 0 upcoming temporarily
      const fallbackEmpty: TourSyncResult = {
        shows: getFallbackTourShows(),
        source: 'fallback',
        configured: true,
        lastSyncedAt: new Date().toISOString(),
        error: 'Bandsintown returned 0 upcoming events; showing verified fallback dates.',
      };
      cachedResult = fallbackEmpty;
      cachedAt = now;
      return fallbackEmpty;
    }

    const live: TourSyncResult = {
      shows: mapped,
      source: 'bandsintown',
      configured: true,
      lastSyncedAt: new Date().toISOString(),
      error: '',
    };
    cachedResult = live;
    cachedAt = now;
    return live;
  } catch (err: any) {
    const fallbackErr: TourSyncResult = {
      shows: cachedResult?.shows?.length ? cachedResult.shows : getFallbackTourShows(),
      source: 'fallback',
      configured: true,
      lastSyncedAt: cachedResult?.lastSyncedAt || null,
      error: err?.message || 'Bandsintown sync failed',
    };
    cachedResult = fallbackErr;
    cachedAt = now - CACHE_TTL_MS + 60_000; // Retry after 1 minute on transient error
    return fallbackErr;
  }
}

export async function getLiveTourDates(opts?: { forceRefresh?: boolean }): Promise<LiveTourShow[]> {
  const res = await getLiveTourSync(opts);
  return res.shows;
}
