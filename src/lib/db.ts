import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NEWS_POSTS, type NewsPost } from '../data/news';

export interface LeadRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source_page: string;
  utm_source: string;
  utm_campaign: string;
  status: 'active' | 'vip' | 'unsubscribed';
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
  city: string;
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
  const fromImport = (import.meta.env as Record<string, string | undefined>)[key];
  return (fromImport || process.env[key] || '').trim();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getEnv('SUPABASE_URL') && getEnv('SUPABASE_SERVICE_ROLE_KEY'));
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

function buildInitialSeed(): LocalStoreSchema {
  const now = Date.now();
  const posts: ManagedPost[] = NEWS_POSTS.map((p, idx) => ({
    ...p,
    id: `seed-post-${idx + 1}`,
    status: 'published',
    updated_at: new Date(p.isoDate).toISOString(),
  }));

  // Seed realistic initial telemetry so charts aren't blank on first local boot
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
  const telemetry: TelemetryEvent[] = [];
  for (let d = 6; d >= 0; d--) {
    const count = 8 + ((7 - d) * 3);
    for (let i = 0; i < count; i++) {
      const item = samplePaths[(d * 5 + i) % samplePaths.length];
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
        country: 'US',
        city: i % 2 === 0 ? 'New York' : 'Los Angeles',
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

async function readLocalStore(): Promise<LocalStoreSchema> {
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(raw) as LocalStoreSchema;
  } catch {
    const seed = buildInitialSeed();
    await writeLocalStore(seed);
    return seed;
  }
}

async function writeLocalStore(data: LocalStoreSchema): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
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
    body: Array.isArray(row.body) ? row.body : String(row.body || '').split(/\n{2,}/).filter(Boolean),
    ctaLabel: row.cta_label || undefined,
    ctaUrl: row.cta_url || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status === 'draft' ? 'draft' : 'published',
    updated_at: row.updated_at,
  };
}

export async function listPosts(includeDrafts = false): Promise<ManagedPost[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    let query = sb.from('news_posts').select('*').order('iso_date', { ascending: false });
    if (!includeDrafts) query = query.eq('status', 'published');
    const { data, error } = await query;
    if (error) {
      console.error('Supabase listPosts error:', error.message);
      return NEWS_POSTS.map((p, i) => ({ ...p, id: `fallback-${i}`, status: 'published' }));
    }
    if (!data || data.length === 0) {
      return includeDrafts
        ? []
        : NEWS_POSTS.map((p, i) => ({ ...p, id: `fallback-${i}`, status: 'published' }));
    }
    return data.map(mapSupabasePost);
  }

  const store = await readLocalStore();
  const filtered = includeDrafts
    ? store.posts
    : store.posts.filter((p) => p.status === 'published');
  return [...filtered].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
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
  const cleanSlug = input.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;

  const wordCount = input.body.join(' ').split(/\s+/).filter(Boolean).length;
  const computedReadTime = input.readTime || `${Math.max(1, Math.round(wordCount / 200))} min read`;

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

  const store = await readLocalStore();
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
  await writeLocalStore(store);
  return record;
}

export async function deletePost(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { error } = await sb.from('news_posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await readLocalStore();
  store.posts = store.posts.filter((p) => p.id !== id);
  await writeLocalStore(store);
}

/* ===========================
   LEADS & NEWSLETTER CRM
   =========================== */

export async function createOrUpdateLead(input: {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  source_page?: string;
  utm_source?: string;
  utm_campaign?: string;
}): Promise<LeadRecord> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  // Optional MailerLite forward if configured
  const mlKey = getEnv('MAILERLITE_API_KEY');
  if (mlKey) {
    const groupId = getEnv('MAILERLITE_GROUP_ID');
    fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mlKey}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: input.first_name || '',
          last_name: input.last_name || '',
          phone: input.phone || '',
        },
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    }).catch(() => {});
  }

  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('leads')
      .upsert(
        {
          email,
          first_name: (input.first_name || '').trim(),
          last_name: (input.last_name || '').trim(),
          phone: (input.phone || '').trim(),
          source_page: (input.source_page || '/').slice(0, 120),
          utm_source: (input.utm_source || '').slice(0, 80),
          utm_campaign: (input.utm_campaign || '').slice(0, 80),
          status: 'active',
        },
        { onConflict: 'email' }
      )
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data as LeadRecord;
  }

  const store = await readLocalStore();
  const idx = store.leads.findIndex((l) => l.email === email);
  const now = new Date().toISOString();
  if (idx >= 0) {
    const updated: LeadRecord = {
      ...store.leads[idx],
      first_name: (input.first_name || store.leads[idx].first_name).trim(),
      last_name: (input.last_name || store.leads[idx].last_name).trim(),
      phone: (input.phone || store.leads[idx].phone).trim(),
      status: 'active',
    };
    store.leads[idx] = updated;
    await writeLocalStore(store);
    return updated;
  }

  const record: LeadRecord = {
    id: crypto.randomUUID(),
    first_name: (input.first_name || '').trim(),
    last_name: (input.last_name || '').trim(),
    email,
    phone: (input.phone || '').trim(),
    source_page: (input.source_page || '/').slice(0, 120),
    utm_source: (input.utm_source || '').slice(0, 80),
    utm_campaign: (input.utm_campaign || '').slice(0, 80),
    status: 'active',
    notes: '',
    created_at: now,
  };
  store.leads.unshift(record);
  await writeLocalStore(store);
  return record;
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
    return (data || []) as LeadRecord[];
  }
  const store = await readLocalStore();
  return [...store.leads].sort((a, b) => b.created_at.localeCompare(a.created_at));
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
    return data as LeadRecord;
  }
  const store = await readLocalStore();
  const idx = store.leads.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error('Lead not found');
  store.leads[idx] = { ...store.leads[idx], ...patch };
  await writeLocalStore(store);
  return store.leads[idx];
}

export async function deleteLead(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { error } = await sb.from('leads').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await readLocalStore();
  store.leads = store.leads.filter((l) => l.id !== id);
  await writeLocalStore(store);
}

/* ===========================
   TELEMETRY & ANALYTICS
   =========================== */

export async function recordTelemetry(
  event: Omit<TelemetryEvent, 'id' | 'created_at'>
): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    await sb.from('telemetry_events').insert(event);
    return;
  }
  const store = await readLocalStore();
  store.telemetry.unshift({
    id: crypto.randomUUID(),
    ...event,
    created_at: new Date().toISOString(),
  });
  if (store.telemetry.length > 5000) {
    store.telemetry = store.telemetry.slice(0, 5000);
  }
  await writeLocalStore(store);
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
    const store = await readLocalStore();
    events = store.telemetry.filter((e) => e.created_at >= cutoff);
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

  // Daily trend buckets
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
  const store = await readLocalStore();
  store.audit.unshift({
    id: crypto.randomUUID(),
    action,
    details,
    ip,
    created_at: new Date().toISOString(),
  });
  store.audit = store.audit.slice(0, 200);
  await writeLocalStore(store);
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
  const store = await readLocalStore();
  return store.audit.slice(0, 50);
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
