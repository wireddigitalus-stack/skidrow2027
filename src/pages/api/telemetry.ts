import type { APIRoute } from 'astro';
import { handlePulsePost } from './pulse';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => handlePulsePost(request);
