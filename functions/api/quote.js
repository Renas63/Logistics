import { EmailMessage } from 'cloudflare:email';

const DESTINATION = 'info@heavytraillogistics.com';
const SENDER = 'quotes@heavytraillogistics.com';
const MAX_BODY_BYTES = 20 * 1024;
const MAX_LENGTHS = {
  name: 120,
  company: 160,
  phone: 40,
  email: 254,
  pickupLocation: 160,
  deliveryLocation: 160,
  equipmentType: 100,
  freightDescription: 3000,
  approxWeight: 80,
  pickupDate: 40,
  additionalInfo: 2000
};
const REQUIRED_FIELDS = [
  'name',
  'company',
  'phone',
  'email',
  'pickupLocation',
  'deliveryLocation',
  'equipmentType',
  'freightDescription'
];
const ALLOWED_FIELDS = new Set([...Object.keys(MAX_LENGTHS), 'website']);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}

function cleanValue(value, maxLength) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  return cleaned.length <= maxLength ? cleaned : null;
}

function formatField(label, value) {
  return `${label}: ${value || 'Not provided'}`;
}

export async function onRequestPost({ request, env }) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json({ error: 'Unsupported request format.' }, 415);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request is too large.' }, 413);

  let payload;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return json({ error: 'Request is too large.' }, 413);
    }
    payload = JSON.parse(body);
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (Object.keys(payload).some((field) => !ALLOWED_FIELDS.has(field))) {
    return json({ error: 'Invalid request fields.' }, 400);
  }
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json({ error: 'Invalid request.' }, 400);
  }

  const quote = {};
  for (const [field, maxLength] of Object.entries(MAX_LENGTHS)) {
    quote[field] = cleanValue(payload[field] ?? '', maxLength);
    if (quote[field] === null) return json({ error: 'Invalid request field.' }, 400);
  }
  if (REQUIRED_FIELDS.some((field) => quote[field] === '')) {
    return json({ error: 'Please complete all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email) || /[\r\n]/.test(quote.email)) {
    return json({ error: 'Please provide a valid email address.' }, 400);
  }

  const emailBody = [
    'New Quote Request - Heavy Trail Logistics',
    '',
    formatField('Name', quote.name),
    formatField('Company', quote.company),
    formatField('Phone', quote.phone),
    formatField('Email', quote.email),
    formatField('Pickup location', quote.pickupLocation),
    formatField('Delivery location', quote.deliveryLocation),
    formatField('Equipment/service type', quote.equipmentType),
    formatField('Freight/load description', quote.freightDescription),
    formatField('Approximate weight', quote.approxWeight),
    formatField('Pickup date', quote.pickupDate),
    formatField('Additional information', quote.additionalInfo)
  ].join('\n');

  try {
    const rawMessage = [
      `From: Heavy Trail Logistics <${SENDER}>`,
      `To: ${DESTINATION}`,
      `Reply-To: ${quote.email}`,
      'Subject: New Quote Request - Heavy Trail Logistics',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      emailBody
    ].join('\r\n');

    await env.QUOTE_EMAIL.send(new EmailMessage(SENDER, DESTINATION, rawMessage));
    return json({ success: true });
  } catch {
    return json({ error: 'Unable to send quote request.' }, 502);
  }
}

export function onRequest(context) {
  if (context.request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  return onRequestPost(context);
}