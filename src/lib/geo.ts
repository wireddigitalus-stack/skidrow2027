import { TOUR_DATES_2027 } from '../data/tour';

export interface StateMeta {
  fips: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export const US_STATES: StateMeta[] = [
  { fips: '01', code: 'AL', name: 'Alabama', lat: 32.8067, lng: -86.7911 },
  { fips: '02', code: 'AK', name: 'Alaska', lat: 61.3707, lng: -152.4044 },
  { fips: '04', code: 'AZ', name: 'Arizona', lat: 33.7298, lng: -111.4312 },
  { fips: '05', code: 'AR', name: 'Arkansas', lat: 34.9697, lng: -92.3731 },
  { fips: '06', code: 'CA', name: 'California', lat: 36.1162, lng: -119.6816 },
  { fips: '08', code: 'CO', name: 'Colorado', lat: 39.0598, lng: -105.3111 },
  { fips: '09', code: 'CT', name: 'Connecticut', lat: 41.5978, lng: -72.7554 },
  { fips: '10', code: 'DE', name: 'Delaware', lat: 39.3185, lng: -75.5071 },
  { fips: '11', code: 'DC', name: 'District of Columbia', lat: 38.9072, lng: -77.0369 },
  { fips: '12', code: 'FL', name: 'Florida', lat: 27.7663, lng: -81.6868 },
  { fips: '13', code: 'GA', name: 'Georgia', lat: 33.0406, lng: -83.6431 },
  { fips: '15', code: 'HI', name: 'Hawaii', lat: 21.0943, lng: -157.4983 },
  { fips: '16', code: 'ID', name: 'Idaho', lat: 44.2405, lng: -114.4788 },
  { fips: '17', code: 'IL', name: 'Illinois', lat: 40.3495, lng: -88.9861 },
  { fips: '18', code: 'IN', name: 'Indiana', lat: 39.8494, lng: -86.2583 },
  { fips: '19', code: 'IA', name: 'Iowa', lat: 42.0115, lng: -93.2105 },
  { fips: '20', code: 'KS', name: 'Kansas', lat: 38.5266, lng: -96.7265 },
  { fips: '21', code: 'KY', name: 'Kentucky', lat: 37.6681, lng: -84.6701 },
  { fips: '22', code: 'LA', name: 'Louisiana', lat: 31.1695, lng: -91.8678 },
  { fips: '23', code: 'ME', name: 'Maine', lat: 44.6939, lng: -69.3819 },
  { fips: '24', code: 'MD', name: 'Maryland', lat: 39.0639, lng: -76.8021 },
  { fips: '25', code: 'MA', name: 'Massachusetts', lat: 42.2302, lng: -71.5301 },
  { fips: '26', code: 'MI', name: 'Michigan', lat: 43.3266, lng: -84.5361 },
  { fips: '27', code: 'MN', name: 'Minnesota', lat: 45.6945, lng: -93.9002 },
  { fips: '28', code: 'MS', name: 'Mississippi', lat: 32.7416, lng: -89.6787 },
  { fips: '29', code: 'MO', name: 'Missouri', lat: 38.4561, lng: -92.2884 },
  { fips: '30', code: 'MT', name: 'Montana', lat: 46.9219, lng: -110.4544 },
  { fips: '31', code: 'NE', name: 'Nebraska', lat: 41.1254, lng: -98.2681 },
  { fips: '32', code: 'NV', name: 'Nevada', lat: 38.3135, lng: -117.0554 },
  { fips: '33', code: 'NH', name: 'New Hampshire', lat: 43.4525, lng: -71.5639 },
  { fips: '34', code: 'NJ', name: 'New Jersey', lat: 40.2989, lng: -74.521 },
  { fips: '35', code: 'NM', name: 'New Mexico', lat: 34.8405, lng: -106.2485 },
  { fips: '36', code: 'NY', name: 'New York', lat: 42.1657, lng: -74.9481 },
  { fips: '37', code: 'NC', name: 'North Carolina', lat: 35.6301, lng: -79.8064 },
  { fips: '38', code: 'ND', name: 'North Dakota', lat: 47.5289, lng: -99.784 },
  { fips: '39', code: 'OH', name: 'Ohio', lat: 40.3888, lng: -82.7649 },
  { fips: '40', code: 'OK', name: 'Oklahoma', lat: 35.5653, lng: -96.9289 },
  { fips: '41', code: 'OR', name: 'Oregon', lat: 44.572, lng: -122.0709 },
  { fips: '42', code: 'PA', name: 'Pennsylvania', lat: 40.5908, lng: -77.2098 },
  { fips: '44', code: 'RI', name: 'Rhode Island', lat: 41.6809, lng: -71.5118 },
  { fips: '45', code: 'SC', name: 'South Carolina', lat: 33.8569, lng: -80.945 },
  { fips: '46', code: 'SD', name: 'South Dakota', lat: 44.2998, lng: -99.4388 },
  { fips: '47', code: 'TN', name: 'Tennessee', lat: 35.7478, lng: -86.6923 },
  { fips: '48', code: 'TX', name: 'Texas', lat: 31.0545, lng: -97.5635 },
  { fips: '49', code: 'UT', name: 'Utah', lat: 40.15, lng: -111.8624 },
  { fips: '50', code: 'VT', name: 'Vermont', lat: 44.0459, lng: -72.7107 },
  { fips: '51', code: 'VA', name: 'Virginia', lat: 37.7693, lng: -78.17 },
  { fips: '53', code: 'WA', name: 'Washington', lat: 47.4009, lng: -121.4905 },
  { fips: '54', code: 'WV', name: 'West Virginia', lat: 38.4912, lng: -80.9545 },
  { fips: '55', code: 'WI', name: 'Wisconsin', lat: 44.2685, lng: -89.6165 },
  { fips: '56', code: 'WY', name: 'Wyoming', lat: 42.756, lng: -107.3025 },
];

export const STATE_BY_CODE = new Map(US_STATES.map((s) => [s.code, s]));
export const STATE_BY_FIPS = new Map(US_STATES.map((s) => [s.fips, s]));

export interface CountryMeta {
  code: string;
  isoNum: string;
  name: string;
  lat: number;
  lng: number;
}

export const COUNTRIES: CountryMeta[] = [
  { code: 'US', isoNum: '840', name: 'United States', lat: 39.8283, lng: -98.5795 },
  { code: 'CA', isoNum: '124', name: 'Canada', lat: 56.1304, lng: -106.3468 },
  { code: 'GB', isoNum: '826', name: 'United Kingdom', lat: 55.3781, lng: -3.436 },
  { code: 'DE', isoNum: '276', name: 'Germany', lat: 51.1657, lng: 10.4515 },
  { code: 'FR', isoNum: '250', name: 'France', lat: 46.2276, lng: 2.2137 },
  { code: 'JP', isoNum: '392', name: 'Japan', lat: 36.2048, lng: 138.2529 },
  { code: 'BR', isoNum: '076', name: 'Brazil', lat: -14.235, lng: -51.9253 },
  { code: 'AU', isoNum: '036', name: 'Australia', lat: -25.2744, lng: 133.7751 },
  { code: 'MX', isoNum: '484', name: 'Mexico', lat: 23.6345, lng: -102.5528 },
  { code: 'SE', isoNum: '752', name: 'Sweden', lat: 60.1282, lng: 18.6435 },
  { code: 'NO', isoNum: '578', name: 'Norway', lat: 60.472, lng: 8.4689 },
  { code: 'FI', isoNum: '246', name: 'Finland', lat: 61.9241, lng: 25.7482 },
  { code: 'IT', isoNum: '380', name: 'Italy', lat: 41.8719, lng: 12.5674 },
  { code: 'ES', isoNum: '724', name: 'Spain', lat: 40.4637, lng: -3.7492 },
  { code: 'NL', isoNum: '528', name: 'Netherlands', lat: 52.1326, lng: 5.2913 },
  { code: 'PL', isoNum: '616', name: 'Poland', lat: 51.9194, lng: 19.1451 },
  { code: 'AR', isoNum: '032', name: 'Argentina', lat: -38.4161, lng: -63.6167 },
  { code: 'CL', isoNum: '152', name: 'Chile', lat: -35.6751, lng: -71.543 },
  { code: 'NZ', isoNum: '554', name: 'New Zealand', lat: -40.9006, lng: 174.886 },
  { code: 'IE', isoNum: '372', name: 'Ireland', lat: 53.1424, lng: -7.6921 },
  { code: 'CH', isoNum: '756', name: 'Switzerland', lat: 46.8182, lng: 8.2275 },
  { code: 'AT', isoNum: '040', name: 'Austria', lat: 47.5162, lng: 14.5501 },
  { code: 'BE', isoNum: '056', name: 'Belgium', lat: 50.5039, lng: 4.4699 },
  { code: 'DK', isoNum: '208', name: 'Denmark', lat: 56.2639, lng: 9.5018 },
  { code: 'PT', isoNum: '620', name: 'Portugal', lat: 39.3999, lng: -8.2245 },
  { code: 'CZ', isoNum: '203', name: 'Czechia', lat: 49.8175, lng: 15.473 },
  { code: 'KR', isoNum: '410', name: 'South Korea', lat: 35.9078, lng: 127.7669 },
  { code: 'ZA', isoNum: '710', name: 'South Africa', lat: -30.5595, lng: 22.9375 },
  { code: 'CO', isoNum: '170', name: 'Colombia', lat: 4.5709, lng: -74.2973 },
  { code: 'IN', isoNum: '356', name: 'India', lat: 20.5937, lng: 78.9629 },
  { code: 'GR', isoNum: '300', name: 'Greece', lat: 39.0742, lng: 21.8243 },
];

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));
export const COUNTRY_BY_ISONUM = new Map(COUNTRIES.map((c) => [c.isoNum, c]));

export function getCountryName(code: string): string {
  const clean = (code || '').toUpperCase();
  if (!clean || clean === 'LOCAL') return 'Local / Dev';
  return COUNTRY_BY_CODE.get(clean)?.name || clean;
}

export function getStateName(code: string): string {
  const clean = (code || '').toUpperCase();
  return STATE_BY_CODE.get(clean)?.name || clean;
}

// Fallback coordinates for legacy telemetry rows recorded prior to lat/lng headers
const CITY_FALLBACK: Record<string, { lat: number; lng: number; region?: string }> = {
  'new york': { lat: 40.7128, lng: -74.006, region: 'NY' },
  'los angeles': { lat: 34.0522, lng: -118.2437, region: 'CA' },
  'toms river': { lat: 39.9537, lng: -74.1979, region: 'NJ' },
  'newark': { lat: 40.7357, lng: -74.1724, region: 'NJ' },
  'chicago': { lat: 41.8781, lng: -87.6298, region: 'IL' },
  'dallas': { lat: 32.7767, lng: -96.797, region: 'TX' },
  'austin': { lat: 30.2672, lng: -97.7431, region: 'TX' },
  'houston': { lat: 29.7604, lng: -95.3698, region: 'TX' },
  'nashville': { lat: 36.1627, lng: -86.7816, region: 'TN' },
  'tampa': { lat: 27.9506, lng: -82.4572, region: 'FL' },
  'miami': { lat: 25.7617, lng: -80.1918, region: 'FL' },
  'orlando': { lat: 28.5383, lng: -81.3792, region: 'FL' },
  'columbus': { lat: 39.9612, lng: -82.9988, region: 'OH' },
  'cleveland': { lat: 41.4993, lng: -81.6944, region: 'OH' },
  'detroit': { lat: 42.3314, lng: -83.0458, region: 'MI' },
  'phoenix': { lat: 33.4484, lng: -112.074, region: 'AZ' },
  'las vegas': { lat: 36.1699, lng: -115.1398, region: 'NV' },
  'seattle': { lat: 47.6062, lng: -122.3321, region: 'WA' },
  'denver': { lat: 39.7392, lng: -104.9903, region: 'CO' },
  'philadelphia': { lat: 39.9526, lng: -75.1652, region: 'PA' },
  'pittsburgh': { lat: 40.4406, lng: -79.9959, region: 'PA' },
  'boston': { lat: 42.3601, lng: -71.0589, region: 'MA' },
  'atlanta': { lat: 33.749, lng: -84.388, region: 'GA' },
  'charlotte': { lat: 35.2271, lng: -80.8431, region: 'NC' },
  'minneapolis': { lat: 44.9778, lng: -93.265, region: 'MN' },
  'london': { lat: 51.5072, lng: -0.1276 },
  'toronto': { lat: 43.6532, lng: -79.3832, region: 'ON' },
  'montreal': { lat: 45.5017, lng: -73.5673, region: 'QC' },
  'vancouver': { lat: 49.2827, lng: -123.1207, region: 'BC' },
  'berlin': { lat: 52.52, lng: 13.405 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'sao paulo': { lat: -23.5505, lng: -46.6333 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'stockholm': { lat: 59.3293, lng: 18.0686 },
  'mexico city': { lat: 19.4326, lng: -99.1332 },
};

export function resolveFallbackGeo(city: string, region: string, country: string) {
  const key = (city || '').trim().toLowerCase();
  if (key && CITY_FALLBACK[key]) {
    const f = CITY_FALLBACK[key];
    return { lat: f.lat, lng: f.lng, region: region || f.region || '' };
  }
  const c = (country || '').toUpperCase();
  const r = (region || '').toUpperCase();
  if (c === 'US' && r && STATE_BY_CODE.has(r)) {
    const st = STATE_BY_CODE.get(r)!;
    return { lat: st.lat, lng: st.lng, region: r };
  }
  if (c && COUNTRY_BY_CODE.has(c)) {
    const co = COUNTRY_BY_CODE.get(c)!;
    return { lat: co.lat, lng: co.lng, region: r };
  }
  return null;
}

const TOUR_COORDS: Record<string, { lat: number; lng: number }> = {
  '2027-03-05-rancho-mirage': { lat: 33.7397, lng: -116.4128 },
  '2027-03-20-new-buffalo': { lat: 41.7939, lng: -86.7439 },
  '2027-04-02-kansas-city': { lat: 39.0997, lng: -94.5786 },
  '2027-04-03-welch': { lat: 44.5666, lng: -92.7355 },
  '2027-04-09-mashantucket': { lat: 41.4718, lng: -71.9598 },
  '2027-04-10-atlantic-city': { lat: 39.3643, lng: -74.4229 },
  '2027-04-16-wheatland': { lat: 39.0099, lng: -121.423 },
  '2027-04-17-reno': { lat: 39.5296, lng: -119.8138 },
  '2027-04-18-shelton': { lat: 47.2151, lng: -123.1007 },
  '2027-04-23-quapaw': { lat: 36.9531, lng: -94.7872 },
  '2027-04-24-grant': { lat: 33.9437, lng: -95.5127 },
  '2027-05-09-daytona-beach': { lat: 29.2108, lng: -81.0228 },
  '2027-05-14-columbus': { lat: 39.9612, lng: -82.9988 },
  '2027-05-29-niagara-falls': { lat: 43.0896, lng: -79.0849 },
};

export interface TourStopGeo {
  id: string;
  date: string;
  city: string;
  region: string;
  country: 'US' | 'CA';
  venue: string;
  kind: 'Headline' | 'Festival';
  lat: number;
  lng: number;
}

export const TOUR_STOPS_GEO: TourStopGeo[] = TOUR_DATES_2027.map((d) => ({
  id: d.id,
  date: `${d.month} ${d.day}, ${d.year}`,
  city: d.city,
  region: d.region,
  country: d.country,
  venue: d.venue,
  kind: d.kind,
  lat: TOUR_COORDS[d.id]?.lat ?? 39.8,
  lng: TOUR_COORDS[d.id]?.lng ?? -98.5,
}));

export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestTourStop(lat: number, lng: number) {
  let best = TOUR_STOPS_GEO[0];
  let bestDist = Infinity;
  for (const stop of TOUR_STOPS_GEO) {
    const dist = haversineMiles(lat, lng, stop.lat, stop.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = stop;
    }
  }
  return { stop: best, miles: Math.round(bestDist) };
}
