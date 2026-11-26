import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../lib/auth';
import { logAdminAction, saveUploadedImage } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      throw new Error('No image file provided.');
    }
    const url = await saveUploadedImage(file);
    await logAdminAction('MEDIA_UPLOAD', `Uploaded ${file.name} -> ${url}`, getClientIp(request));
    return new Response(JSON.stringify({ ok: true, url }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Upload failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
