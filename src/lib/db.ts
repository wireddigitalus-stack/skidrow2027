import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NEWS_POSTS, type NewsPost } from '../data/news';
import {
  getCountryName,
  getStateName,
  nearestTourStop,
  resolveFallbackGeo,
  TOUR_STOPS_GEO,
} from './geo';

export interface LeadRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  source_page: string;
  utm_source: string;
  utm_campaign: string;
  status: 'active' | 'vip' | 'unsubscribed';
  mailerlite_status: 'pending' | 'synced' | 'error';
  mailerlite_synced_at?: string | null;
  mailerlite_error: string;
  notes: string;
  created_at: string;
}

export interface ManagedPost extends NewsPost {
  id: string;
  status: 'published' | 'draft';
  updated_at?: string;
}

export interface TelemetryEvent {
  id: string;
  session_id: string;
  event_type: 'pageview' | 'click' | 'video_play' | 'signup';
  path: string;
  target_label: string;
  target_url: string;
  referrer: string;
  utm_source: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  country: string;
  region?: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  postal_code?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  ip: string;
  created_at: string;
}

interface LocalStoreSchema {
  leads: LeadRecord[];
  posts: ManagedPost[];
  telemetry: TelemetryEvent[];
  audit: AuditLog[];
}

function getEnv(key: string): string {
  const fromProc = process.env[key];
  const fromImport = (import.meta.env as Record<string, string | undefined>)[key];
  return (fromProc || fromImport || '').trim();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getEnv('SUPABASE_URL') && getEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

export function isMailerLiteConfigured(): boolean {
  return Boolean(getEnv('MAILERLITE_API_KEY'));
}

let cachedClient: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!cachedClient) {
    cachedClient = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}

const LOCAL_DB_PATH = path.resolve(process.cwd(), '.data/store.json');
let localQueue: Promise<unknown> = Promise.resolve();
let memoryCache: LocalStoreSchema | null = null;

function withLocalLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = localQueue.then(fn, fn);
  localQueue = next.catch(() => {});
  return next;
}

function buildInitialSeed(): LocalStoreSchema {
  const now = Date.now();
  const posts: ManagedPost[] = NEWS_POSTS.map((p, idx) => ({
    ...p,
    id: `seed-post-${idx + 1}`,
    status: 'published',
    updated_at: new Date(p.isoDate).toISOString(),
  }));

  const samplePaths = [
    { path: '/', label: '', type: 'pageview' as const },
    { path: '/tour', label: '', type: 'pageview' as const },
    { path: '/music', label: '', type: 'pageview' as const },
    { path: '/music/skid-row-1989', label: '', type: 'pageview' as const },
    { path: '/videos', label: '', type: 'pageview' as const },
    { path: '/bio', label: '', type: 'pageview' as const },
    { path: '/news', label: '', type: 'pageview' as const },
    { path: '/tour', label: 'Tickets: Rancho Mirage, CA', type: 'click' as const },
    { path: '/tour', label: 'Tickets: Welcome to Rockville', type: 'click' as const },
    { path: '/', label: 'Official Merch Store', type: 'click' as const },
    { path: '/', label: "Stream: Won't Get Fooled Again", type: 'click' as const },
  ];
  const devices: Array<'mobile' | 'desktop' | 'tablet'> = [
    'mobile', 'mobile', 'mobile', 'desktop', 'mobile', 'tablet',
  ];
  const seedGeoPool = [
    { country: 'US', region: 'NJ', city: 'Toms River', lat: 39.9537, lng: -74.1979 },
    { country: 'US', region: 'NJ', city: 'Newark', lat: 40.7357, lng: -74.1724 },
    { country: 'US', region: 'NY', city: 'New York', lat: 40.7128, lng: -74.006 },
    { country: 'US', region: 'CA', city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { country: 'US', region: 'CA', city: 'San Diego', lat: 32.7157, lng: -117.1611 },
    { country: 'US', region: 'TX', city: 'Dallas', lat: 32.7767, lng: -96.797 },
    { country: 'US', region: 'TX', city: 'Austin', lat: 30.2672, lng: -97.7431 },
    { country: 'US', region: 'TX', city: 'Houston', lat: 29.7604, lng: -95.3698 },
    { country: 'US', region: 'FL', city: 'Tampa', lat: 27.9506, lng: -82.4572 },
    { country: 'US', region: 'FL', city: 'Daytona Beach', lat: 29.2108, lng: -81.0228 },
    { country: 'US', region: 'OH', city: 'Columbus', lat: 39.9612, lng: -82.9988 },
    { country: 'US', region: 'OH', city: 'Cleveland', lat: 41.4993, lng: -81.6944 },
    { country: 'US', region: 'IL', city: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { country: 'US', region: 'TN', city: 'Nashville', lat: 36.1627, lng: -86.7816 },
    { country: 'US', region: 'PA', city: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
    { country: 'US', region: 'AZ', city: 'Phoenix', lat: 33.4484, lng: -112.074 },
    { country: 'US', region: 'NV', city: 'Las Vegas', lat: 36.1699, lng: -115.1398 },
    { country: 'US', region: 'CO', city: 'Denver', lat: 39.7392, lng: -104.9903 },
    { country: 'US', region: 'WA', city: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { country: 'US', region: 'MI', city: 'Detroit', lat: 42.3314, lng: -83.0458 },
    { country: 'US', region: 'GA', city: 'Atlanta', lat: 33.749, lng: -84.388 },
    { country: 'US', region: 'MA', city: 'Boston', lat: 42.3601, lng: -71.0589 },
    { country: 'CA', region: 'ON', city: 'Toronto', lat: 43.6532, lng: -79.3832 },
    { country: 'GB', region: 'ENG', city: 'London', lat: 51.5072, lng: -0.1276 },
    { country: 'DE', region: 'BE', city: 'Berlin', lat: 52.52, lng: 13.405 },
    { country: 'SE', region: 'AB', city: 'Stockholm', lat: 59.3293, lng: 18.0686 },
    { country: 'JP', region: '13', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { country: 'BR', region: 'SP', city: 'Sao Paulo', lat: -23.5505, lng: -46.6333 },
    { country: 'AU', region: 'NSW', city: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { country: 'MX', region: 'CMX', city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  ];
  const telemetry: TelemetryEvent[] = [];
  for (let d = 6; d >= 0; d--) {
    const count = 14 + (7 - d) * 4;
    for (let i = 0; i < count; i++) {
      const item = samplePaths[(d * 5 + i) % samplePaths.length];
      // Bias ~76% toward US rock markets for realistic fanbase density
      const geo =
        i % 4 === 0
          ? seedGeoPool[(d * 7 + i) % seedGeoPool.length]
          : seedGeoPool[(d * 3 + i) % 22];
      telemetry.push({
        id: crypto.randomUUID(),
        session_id: `seed-sess-${d}-${Math.floor(i / 2)}`,
        event_type: item.type,
        path: item.path,
        target_label: item.label,
        target_url: item.type === 'click' ? 'https://www.bandsintown.com/a/1473-skid-row' : '',
        referrer: i % 3 === 0 ? 'instagram.com' : i % 3 === 1 ? 'google.com' : 'direct',
        utm_source: i % 4 === 0 ? 'instagram' : '',
        device_type: devices[(d + i) % devices.length],
        country: geo.country,
        region: geo.region,
        city: geo.city,
        latitude: geo.lat,
        longitude: geo.lng,
        postal_code: '',
        created_at: new Date(now - d * 86400000 - i * 1800000).toISOString(),
      });
    }
  }

  return {
    leads: [],
    posts,
    telemetry,
    audit: [
      {
        id: crypto.randomUUID(),
        action: 'SYSTEM_INIT',
        details: 'Initialized local Backstage dev store with 20 Skid Row news posts',
        ip: 'local',
        created_at: new Date(now).toISOString(),
      },
    ],
  };
}

async function readLocalStoreUnlocked(): Promise<LocalStoreSchema> {
  if (memoryCache) return memoryCache;
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as LocalStoreSchema;
    memoryCache = parsed;
    return parsed;
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      const seed = buildInitialSeed();
      await writeLocalStoreUnlocked(seed);
      return seed;
    }
    // Never wipe an existing store file on transient error
    const fallback = buildInitialSeed();
    return fallback;
  }
}

async function writeLocalStoreUnlocked(data: LocalStoreSchema): Promise<void> {
  memoryCache = data;
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  const tmpPath = `${LOCAL_DB_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmpPath, LOCAL_DB_PATH);
}

/* ===========================
   DATABASE HEALTH DIAGNOSTICS
   =========================== */

export async function getDatabaseHealth() {
  if (!isSupabaseConfigured()) {
    return withLocalLock(async () => {
      const store = await readLocalStoreUnlocked();
      return {
        connected: true,
        backend: 'Local Dev Store (.data/store.json)',
        isSupabase: false,
        error: '',
        counts: {
          leads: store.leads.length,
          news_posts: store.posts.length,
          telemetry_events: store.telemetry.length,
          admin_audit_logs: store.audit.length,
        },
      };
    });
  }

  try {
    const sb = getSupabase();
    const [leadsRes, postsRes, teleRes, auditRes] = await Promise.all([
      sb.from('leads').select('*', { count: 'exact', head: true }),
      sb.from('news_posts').select('*', { count: 'exact', head: true }),
      sb.from('telemetry_events').select('*', { count: 'exact', head: true }),
      sb.from('admin_audit_logs').select('*', { count: 'exact', head: true }),
    ]);

    const firstErr =
      leadsRes.error || postsRes.error || teleRes.error || auditRes.error;
    if (firstErr) {
      return {
        connected: false,
        backend: 'Supabase Postgres',
        isSupabase: true,
        error: firstErr.message,
        counts: {
          leads: leadsRes.count ?? 0,
          news_posts: postsRes.count ?? 0,
          telemetry_events: teleRes.count ?? 0,
          admin_audit_logs: auditRes.count ?? 0,
        },
      };
    }

    return {
      connected: true,
      backend: 'Supabase Postgres',
      isSupabase: true,
      error: '',
      counts: {
        leads: leadsRes.count ?? 0,
        news_posts: postsRes.count ?? 0,
        telemetry_events: teleRes.count ?? 0,
        admin_audit_logs: auditRes.count ?? 0,
      },
    };
  } catch (err: any) {
    return {
      connected: false,
      backend: 'Supabase Postgres',
      isSupabase: true,
      error: err?.message || 'Unable to reach Supabase',
      counts: { leads: 0, news_posts: 0, telemetry_events: 0, admin_audit_logs: 0 },
    };
  }
}

/* ===========================
   NEWS / BLOG POSTS CMS
   =========================== */

function mapSupabasePost(row: Record<string, any>): ManagedPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date_label,
    isoDate: row.iso_date,
    readTime: row.read_time || '2 min read',
    category: row.category || 'Band News',
    image: row.image_url || '/images/hero-band.jpg',
    excerpt: row.excerpt || '',
    body: Array.isArray(row.body)
      ? row.body
      : String(row.body || '').split(/\n{2,}/).filter(Boolean),
    ctaLabel: row.cta_label || undefined,
    ctaUrl: row.cta_url || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status === 'draft' ? 'draft' : 'published',
    updated_at: row.updated_at,
  };
}

export async function seedInitialPosts(): Promise<ManagedPost[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const rows = NEWS_POSTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      date_label: p.date,
      iso_date: p.isoDate,
      read_time: p.readTime || '2 min read',
      category: p.category,
      image_url: p.image || '/images/hero-band.jpg',
      excerpt: p.excerpt || '',
      body: p.body || [],
      cta_label: p.ctaLabel || '',
      cta_url: p.ctaUrl || '',
      tags: p.tags || [],
      status: 'published',
      updated_at: new Date().toISOString(),
    }));
    const { data, error } = await sb
      .from('news_posts')
      .upsert(rows, { onConflict: 'slug' })
      .select('*')
      .order('iso_date', { ascending: false });
    if (error) {
      throw new Error(`Supabase seed failed: ${error.message}`);
    }
    return (data || []).map(mapSupabasePost);
  }

  return withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    for (const p of NEWS_POSTS) {
      if (!store.posts.some((existing) => existing.slug === p.slug)) {
        store.posts.push({
          ...p,
          id: crypto.randomUUID(),
          status: 'published',
          updated_at: new Date().toISOString(),
        });
      }
    }
    store.posts.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
    await writeLocalStoreUnlocked(store);
    return store.posts;
  });
}

export async function listPosts(includeDrafts = false): Promise<ManagedPost[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    let query = sb.from('news_posts').select('*').order('iso_date', { ascending: false });
    if (!includeDrafts) query = query.eq('status', 'published');
    const { data, error } = await query;
    if (error) {
      console.error('Supabase listPosts error:', error.message);
      if (includeDrafts) throw new Error(`Supabase error: ${error.message}`);
      return NEWS_POSTS.map((p, i) => ({ ...p, id: `fallback-${i}`, status: 'published' }));
    }
    if (!data || data.length === 0) {
      // Auto-seed the 20 official Skid Row posts on first connect if none have been deleted
      const { count: deleteCount } = await sb
        .from('admin_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('action', 'POST_DELETE');
      if (!deleteCount) {
        try {
          const seeded = await seedInitialPosts();
          if (seeded.length > 0) return seeded;
        } catch (err) {
          console.error('Auto-seed failed:', err);
          if (includeDrafts) throw err;
        }
      }
      return includeDrafts
        ? []
        : NEWS_POSTS.map((p, i) => ({ ...p, id: `fallback-${i}`, status: 'published' }));
    }
    return data.map(mapSupabasePost);
  }

  return withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    const filtered = includeDrafts
      ? store.posts
      : store.posts.filter((p) => p.status === 'published');
    return [...filtered].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  });
}

export async function getPostBySlug(slug: string, includeDrafts = false): Promise<ManagedPost | null> {
  const posts = await listPosts(includeDrafts);
  return posts.find((p) => p.slug === slug) || null;
}

export async function upsertPost(input: {
  id?: string;
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  readTime?: string;
  category: NewsPost['category'];
  image: string;
  excerpt: string;
  body: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  tags: string[];
  status: 'published' | 'draft';
}): Promise<ManagedPost> {
  const cleanSlug =
    input.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;

  const wordCount = input.body.join(' ').split(/\s+/).filter(Boolean).length;
  const computedReadTime =
    input.readTime || `${Math.max(1, Math.round(wordCount / 200))} min read`;

  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const payload = {
      slug: cleanSlug,
      title: input.title,
      date_label: input.date,
      iso_date: input.isoDate,
      read_time: computedReadTime,
      category: input.category,
      image_url: input.image || '/images/hero-band.jpg',
      excerpt: input.excerpt,
      body: input.body,
      cta_label: input.ctaLabel || '',
      cta_url: input.ctaUrl || '',
      tags: input.tags,
      status: input.status,
      updated_at: new Date().toISOString(),
    };

    if (input.id && !input.id.startsWith('seed-') && !input.id.startsWith('fallback-')) {
      const { data, error } = await sb
        .from('news_posts')
        .update(payload)
        .eq('id', input.id)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return mapSupabasePost(data);
    }

    const { data, error } = await sb
      .from('news_posts')
      .upsert(payload, { onConflict: 'slug' })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapSupabasePost(data);
  }

  return withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    const existingIdx = store.posts.findIndex(
      (p) => (input.id && p.id === input.id) || p.slug === cleanSlug
    );
    const record: ManagedPost = {
      id: existingIdx >= 0 ? store.posts[existingIdx].id : crypto.randomUUID(),
      slug: cleanSlug,
      title: input.title,
      date: input.date,
      isoDate: input.isoDate,
      readTime: computedReadTime,
      category: input.category,
      image: input.image || '/images/hero-band.jpg',
      excerpt: input.excerpt,
      body: input.body,
      ctaLabel: input.ctaLabel || undefined,
      ctaUrl: input.ctaUrl || undefined,
      tags: input.tags,
      status: input.status,
      updated_at: new Date().toISOString(),
    };
    if (existingIdx >= 0) {
      store.posts[existingIdx] = record;
    } else {
      store.posts.unshift(record);
    }
    await writeLocalStoreUnlocked(store);
    return record;
  });
}

export async function deletePost(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { error } = await sb.from('news_posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  await withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    store.posts = store.posts.filter((p) => p.id !== id);
    await writeLocalStoreUnlocked(store);
  });
}

/* ===========================
   LEADS & MAILERLITE SYNC
   =========================== */

function normalizeLead(row: Record<string, any>): LeadRecord {
  return {
    id: row.id,
    first_name: row.first_name || '',
    last_name: row.last_name || '',
    email: row.email || '',
    phone: row.phone || '',
    zip_code: row.zip_code || '',
    source_page: row.source_page || '/',
    utm_source: row.utm_source || '',
    utm_campaign: row.utm_campaign || '',
    status: row.status || 'active',
    mailerlite_status: row.mailerlite_status || 'pending',
    mailerlite_synced_at: row.mailerlite_synced_at || null,
    mailerlite_error: row.mailerlite_error || '',
    notes: row.notes || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function pushLeadToMailerLite(
  lead: LeadRecord
): Promise<{ status: 'synced' | 'pending' | 'error'; error: string }> {
  const mlKey = getEnv('MAILERLITE_API_KEY');
  if (!mlKey) {
    return { status: 'pending', error: '' };
  }

  const groupId = getEnv('MAILERLITE_GROUP_ID');
  const fields: Record<string, string> = {};
  if (lead.first_name) fields.name = lead.first_name;
  if (lead.last_name) fields.last_name = lead.last_name;
  if (lead.phone) fields.phone = lead.phone;
  if (lead.zip_code) fields.z_i_p = lead.zip_code;

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${mlKey}`,
      },
      body: JSON.stringify({
        email: lead.email,
        fields,
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    });

    if (res.ok) {
      return { status: 'synced', error: '' };
    }
    const errText = await res.text().catch(() => `HTTP ${res.status}`);
    return { status: 'error', error: `MailerLite HTTP ${res.status}: ${errText.slice(0, 180)}` };
  } catch (err: any) {
    return { status: 'error', error: err?.message || 'MailerLite network error' };
  }
}

async function persistMailerLiteState(
  id: string,
  state: { status: 'synced' | 'pending' | 'error'; error: string }
): Promise<void> {
  const patch = {
    mailerlite_status: state.status,
    mailerlite_synced_at: state.status === 'synced' ? new Date().toISOString() : null,
    mailerlite_error: state.error,
  };

  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    await sb.from('leads').update(patch).eq('id', id);
    return;
  }

  await withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    const idx = store.leads.findIndex((l) => l.id === id);
    if (idx >= 0) {
      store.leads[idx] = { ...store.leads[idx], ...patch };
      await writeLocalStoreUnlocked(store);
    }
  });
}

export async function createOrUpdateLead(input: {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  zip_code?: string;
  source_page?: string;
  utm_source?: string;
  utm_campaign?: string;
}): Promise<LeadRecord> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  let saved: LeadRecord;

  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const basePayload = {
      email,
      first_name: (input.first_name || '').trim(),
      last_name: (input.last_name || '').trim(),
      phone: (input.phone || '').trim(),
      zip_code: (input.zip_code || '').trim().slice(0, 20),
      source_page: (input.source_page || '/').slice(0, 120),
      utm_source: (input.utm_source || '').slice(0, 80),
      utm_campaign: (input.utm_campaign || '').slice(0, 80),
      status: 'active',
    };

    let { data, error } = await sb
      .from('leads')
      .upsert(basePayload, { onConflict: 'email' })
      .select('*')
      .single();

    // Graceful fallback if user hasn't run the new zip_code ALTER TABLE yet
    if (error && /zip_code|mailerlite_/i.test(error.message)) {
      const legacyPayload = {
        email: basePayload.email,
        first_name: basePayload.first_name,
        last_name: basePayload.last_name,
        phone: basePayload.phone,
        source_page: basePayload.source_page,
        utm_source: basePayload.utm_source,
        utm_campaign: basePayload.utm_campaign,
        status: 'active',
      };
      const retry = await sb
        .from('leads')
        .upsert(legacyPayload, { onConflict: 'email' })
        .select('*')
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error || !data) throw new Error(error?.message || 'Could not save lead');
    saved = normalizeLead(data);
  } else {
    saved = await withLocalLock(async () => {
      const store = await readLocalStoreUnlocked();
      const idx = store.leads.findIndex((l) => l.email === email);
      const now = new Date().toISOString();
      if (idx >= 0) {
        const updated: LeadRecord = normalizeLead({
          ...store.leads[idx],
          first_name: (input.first_name || store.leads[idx].first_name).trim(),
          last_name: (input.last_name || store.leads[idx].last_name).trim(),
          phone: (input.phone || store.leads[idx].phone).trim(),
          zip_code: (input.zip_code || store.leads[idx].zip_code || '').trim().slice(0, 20),
          status: 'active',
        });
        store.leads[idx] = updated;
        await writeLocalStoreUnlocked(store);
        return updated;
      }

      const record: LeadRecord = {
        id: crypto.randomUUID(),
        first_name: (input.first_name || '').trim(),
        last_name: (input.last_name || '').trim(),
        email,
        phone: (input.phone || '').trim(),
        zip_code: (input.zip_code || '').trim().slice(0, 20),
        source_page: (input.source_page || '/').slice(0, 120),
        utm_source: (input.utm_source || '').slice(0, 80),
        utm_campaign: (input.utm_campaign || '').slice(0, 80),
        status: 'active',
        mailerlite_status: 'pending',
        mailerlite_synced_at: null,
        mailerlite_error: '',
        notes: '',
        created_at: now,
      };
      store.leads.unshift(record);
      await writeLocalStoreUnlocked(store);
      return record;
    });
  }

  // Real-time MailerLite official API sync when configured
  if (isMailerLiteConfigured()) {
    const mlResult = await pushLeadToMailerLite(saved);
    await persistMailerLiteState(saved.id, mlResult);
    saved = {
      ...saved,
      mailerlite_status: mlResult.status,
      mailerlite_synced_at: mlResult.status === 'synced' ? new Date().toISOString() : null,
      mailerlite_error: mlResult.error,
    };
  }

  return saved;
}

export async function syncPendingLeadsToMailerLite() {
  if (!isMailerLiteConfigured()) {
    throw new Error('MAILERLITE_API_KEY is not configured yet in your environment variables.');
  }
  const leads = await listLeads();
  const targets = leads.filter(
    (l) => l.status !== 'unsubscribed' && l.mailerlite_status !== 'synced'
  );
  let synced = 0;
  let failed = 0;

  for (const lead of targets) {
    const res = await pushLeadToMailerLite(lead);
    await persistMailerLiteState(lead.id, res);
    if (res.status === 'synced') synced++;
    else failed++;
  }

  return { attempted: targets.length, synced, failed };
}

export async function listLeads(): Promise<LeadRecord[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);
    return (data || []).map(normalizeLead);
  }
  return withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    return [...store.leads].map(normalizeLead).sort((a, b) => b.created_at.localeCompare(a.created_at));
  });
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<LeadRecord, 'status' | 'notes'>>
): Promise<LeadRecord> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('leads')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return normalizeLead(data);
  }
  return withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    const idx = store.leads.findIndex((l) => l.id === id);
    if (idx < 0) throw new Error('Lead not found');
    store.leads[idx] = normalizeLead({ ...store.leads[idx], ...patch });
    await writeLocalStoreUnlocked(store);
    return store.leads[idx];
  });
}

export async function deleteLead(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { error } = await sb.from('leads').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  await withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    store.leads = store.leads.filter((l) => l.id !== id);
    await writeLocalStoreUnlocked(store);
  });
}

/* ===========================
   TELEMETRY & ANALYTICS
   =========================== */

export async function recordTelemetry(
  event: Omit<TelemetryEvent, 'id' | 'created_at'>
): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    let { error } = await sb.from('telemetry_events').insert(event);
    // Graceful fallback if the new geo columns haven't been added in Supabase yet
    if (error && /region|latitude|longitude|postal_code/i.test(error.message)) {
      const legacy = {
        session_id: event.session_id,
        event_type: event.event_type,
        path: event.path,
        target_label: event.target_label,
        target_url: event.target_url,
        referrer: event.referrer,
        utm_source: event.utm_source,
        device_type: event.device_type,
        country: event.country,
        city: event.city,
      };
      const retry = await sb.from('telemetry_events').insert(legacy);
      error = retry.error;
    }
    if (error) console.error('Supabase telemetry insert error:', error.message);
    return;
  }
  await withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    store.telemetry.unshift({
      id: crypto.randomUUID(),
      ...event,
      created_at: new Date().toISOString(),
    });
    if (store.telemetry.length > 5000) {
      store.telemetry = store.telemetry.slice(0, 5000);
    }
    await writeLocalStoreUnlocked(store);
  });
}

export async function getAnalyticsSummary(days = 7) {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  let events: TelemetryEvent[] = [];

  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { data } = await sb
      .from('telemetry_events')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(5000);
    events = (data || []) as TelemetryEvent[];
  } else {
    events = await withLocalLock(async () => {
      const store = await readLocalStoreUnlocked();
      return store.telemetry.filter((e) => e.created_at >= cutoff);
    });
  }

  const pageviews = events.filter((e) => e.event_type === 'pageview');
  const clicks = events.filter((e) => e.event_type === 'click' || e.event_type === 'video_play');
  const signups = events.filter((e) => e.event_type === 'signup');
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;

  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
  for (const pv of pageviews) {
    deviceCounts[pv.device_type] = (deviceCounts[pv.device_type] || 0) + 1;
  }

  const pageMap = new Map<string, number>();
  for (const pv of pageviews) {
    pageMap.set(pv.path, (pageMap.get(pv.path) || 0) + 1);
  }
  const topPages = [...pageMap.entries()]
    .map(([p, count]) => ({ path: p, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const clickMap = new Map<string, number>();
  for (const c of clicks) {
    const key = c.target_label || c.target_url || c.path;
    clickMap.set(key, (clickMap.get(key) || 0) + 1);
  }
  const topClicks = [...clickMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const refMap = new Map<string, number>();
  for (const pv of pageviews) {
    const key = pv.utm_source || pv.referrer || 'direct';
    refMap.set(key, (refMap.get(key) || 0) + 1);
  }
  const topSources = [...refMap.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const daily: Array<{ date: string; label: string; pageviews: number; clicks: number }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 86400000);
    const iso = dt.toISOString().slice(0, 10);
    const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    daily.push({ date: iso, label, pageviews: 0, clicks: 0 });
  }
  const dailyMap = new Map(daily.map((d) => [d.date, d]));
  for (const e of events) {
    const bucket = dailyMap.get(e.created_at.slice(0, 10));
    if (!bucket) continue;
    if (e.event_type === 'pageview') bucket.pageviews += 1;
    if (e.event_type === 'click' || e.event_type === 'video_play') bucket.clicks += 1;
  }

  // ==================== GEO INTELLIGENCE AGGREGATION ====================
  type CityBucket = {
    city: string;
    region: string;
    country: string;
    countryName: string;
    lat: number;
    lng: number;
    views: number;
    clicks: number;
    mobileViews: number;
    desktopViews: number;
    sessions: Set<string>;
    lastSeen: string;
  };
  type StateBucket = {
    code: string;
    name: string;
    views: number;
    clicks: number;
    mobileViews: number;
    desktopViews: number;
    sessions: Set<string>;
    cityCounts: Map<string, number>;
  };
  type CountryBucket = {
    code: string;
    name: string;
    views: number;
    clicks: number;
    mobileViews: number;
    desktopViews: number;
    sessions: Set<string>;
  };

  const cityMap = new Map<string, CityBucket>();
  const stateMap = new Map<string, StateBucket>();
  const countryMap = new Map<string, CountryBucket>();
  const recentPings: Array<{
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
    eventType: string;
    deviceType: string;
    path: string;
    createdAt: string;
  }> = [];

  for (const e of events) {
    const country = (e.country || '').trim().toUpperCase();
    if (!country || country === 'LOCAL') continue;

    let region = (e.region || '').trim().toUpperCase();
    const city = (e.city || '').trim();
    let lat = typeof e.latitude === 'number' && Number.isFinite(e.latitude) ? e.latitude : null;
    let lng = typeof e.longitude === 'number' && Number.isFinite(e.longitude) ? e.longitude : null;

    if (lat === null || lng === null || (country === 'US' && !region)) {
      const fb = resolveFallbackGeo(city, region, country);
      if (fb) {
        if (lat === null) lat = fb.lat;
        if (lng === null) lng = fb.lng;
        if (!region && fb.region) region = fb.region;
      }
    }

    const isView = e.event_type === 'pageview';
    const isClick = e.event_type === 'click' || e.event_type === 'video_play';
    const isMobile = e.device_type === 'mobile' || e.device_type === 'tablet';

    // Country aggregation
    let cb = countryMap.get(country);
    if (!cb) {
      cb = {
        code: country,
        name: getCountryName(country),
        views: 0,
        clicks: 0,
        mobileViews: 0,
        desktopViews: 0,
        sessions: new Set(),
      };
      countryMap.set(country, cb);
    }
    cb.sessions.add(e.session_id);
    if (isView) {
      cb.views += 1;
      if (isMobile) cb.mobileViews += 1;
      else cb.desktopViews += 1;
    }
    if (isClick) cb.clicks += 1;

    // US State aggregation
    if (country === 'US' && region && region.length === 2) {
      let sb = stateMap.get(region);
      if (!sb) {
        sb = {
          code: region,
          name: getStateName(region),
          views: 0,
          clicks: 0,
          mobileViews: 0,
          desktopViews: 0,
          sessions: new Set(),
          cityCounts: new Map(),
        };
        stateMap.set(region, sb);
      }
      sb.sessions.add(e.session_id);
      if (isView) {
        sb.views += 1;
        if (isMobile) sb.mobileViews += 1;
        else sb.desktopViews += 1;
      }
      if (isClick) sb.clicks += 1;
      if (city) sb.cityCounts.set(city, (sb.cityCounts.get(city) || 0) + 1);
    }

    // City pin aggregation
    if (lat !== null && lng !== null) {
      const displayCity = city || (country === 'US' && region ? getStateName(region) : getCountryName(country));
      const key = `${displayCity.toLowerCase()}|${region}|${country}`;
      let kb = cityMap.get(key);
      if (!kb) {
        kb = {
          city: displayCity,
          region,
          country,
          countryName: getCountryName(country),
          lat,
          lng,
          views: 0,
          clicks: 0,
          mobileViews: 0,
          desktopViews: 0,
          sessions: new Set(),
          lastSeen: e.created_at,
        };
        cityMap.set(key, kb);
      }
      kb.sessions.add(e.session_id);
      if (isView) {
        kb.views += 1;
        if (isMobile) kb.mobileViews += 1;
        else kb.desktopViews += 1;
      }
      if (isClick) kb.clicks += 1;
      if (e.created_at > kb.lastSeen) kb.lastSeen = e.created_at;

      if (recentPings.length < 24) {
        recentPings.push({
          city: displayCity,
          region,
          country,
          lat,
          lng,
          eventType: e.event_type,
          deviceType: e.device_type,
          path: e.path,
          createdAt: e.created_at,
        });
      }
    }
  }

  const totalGeoViews = Math.max(
    1,
    [...countryMap.values()].reduce((acc, c) => acc + c.views, 0)
  );

  const countries = [...countryMap.values()]
    .map((c) => ({
      code: c.code,
      name: c.name,
      views: c.views,
      clicks: c.clicks,
      mobileViews: c.mobileViews,
      desktopViews: c.desktopViews,
      sessions: c.sessions.size,
      pct: Math.round((c.views / totalGeoViews) * 100),
    }))
    .sort((a, b) => b.views + b.clicks - (a.views + a.clicks));

  const usStates = [...stateMap.values()]
    .map((s) => {
      let topCity = '';
      let topCount = 0;
      for (const [cName, cnt] of s.cityCounts.entries()) {
        if (cnt > topCount) {
          topCount = cnt;
          topCity = cName;
        }
      }
      return {
        code: s.code,
        name: s.name,
        views: s.views,
        clicks: s.clicks,
        mobileViews: s.mobileViews,
        desktopViews: s.desktopViews,
        sessions: s.sessions.size,
        topCity,
      };
    })
    .sort((a, b) => b.views + b.clicks - (a.views + a.clicks));

  const cities = [...cityMap.values()]
    .map((c) => {
      const nearest = nearestTourStop(c.lat, c.lng);
      return {
        city: c.city,
        region: c.region,
        country: c.country,
        countryName: c.countryName,
        lat: c.lat,
        lng: c.lng,
        views: c.views,
        clicks: c.clicks,
        mobileViews: c.mobileViews,
        desktopViews: c.desktopViews,
        sessions: c.sessions.size,
        lastSeen: c.lastSeen,
        nearestStopCity: `${nearest.stop.city}, ${nearest.stop.region}`,
        nearestStopMiles: nearest.miles,
      };
    })
    .sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
    .slice(0, 150);

  const tourOpportunities = cities
    .filter((c) => (c.country === 'US' || c.country === 'CA') && c.nearestStopMiles >= 100)
    .slice(0, 15);

  const usTotalViews = countries.find((c) => c.code === 'US')?.views || 0;

  return {
    days,
    totalPageviews: pageviews.length,
    uniqueSessions,
    totalClicks: clicks.length,
    totalSignups: signups.length,
    mobilePct: pageviews.length
      ? Math.round((deviceCounts.mobile / pageviews.length) * 100)
      : 0,
    deviceCounts,
    daily,
    topPages,
    topClicks,
    topSources,
    recentEvents: events.slice(0, 25),
    geo: {
      totalCountries: countries.length,
      totalUsStates: usStates.length,
      totalCities: cities.length,
      usSharePct: Math.round((usTotalViews / totalGeoViews) * 100),
      countries,
      usStates,
      cities,
      tourOpportunities,
      tourStops: TOUR_STOPS_GEO,
      recentPings,
    },
  };
}

/* ===========================
   AUDIT LOGS & MEDIA UPLOAD
   =========================== */

export async function logAdminAction(action: string, details: string, ip: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    await sb.from('admin_audit_logs').insert({ action, details, ip });
    return;
  }
  await withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    store.audit.unshift({
      id: crypto.randomUUID(),
      action,
      details,
      ip,
      created_at: new Date().toISOString(),
    });
    store.audit = store.audit.slice(0, 200);
    await writeLocalStoreUnlocked(store);
  });
}

export async function listAuditLogs(): Promise<AuditLog[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { data } = await sb
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    return (data || []) as AuditLog[];
  }
  return withLocalLock(async () => {
    const store = await readLocalStoreUnlocked();
    return store.audit.slice(0, 50);
  });
}

export async function saveUploadedImage(file: File): Promise<string> {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) {
    throw new Error('Only JPG, PNG, WebP, or AVIF images are allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be under 5MB.');
  }
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const filename = `post-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { error } = await sb.storage.from('media').upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);
    const { data } = sb.storage.from('media').getPublicUrl(filename);
    return data.publicUrl;
  }

  const dir = path.resolve(process.cwd(), 'public/uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}
