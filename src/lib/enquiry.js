// Sends an enquiry to Formspree. The endpoint comes from an environment variable, never from source code:
//   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx   (see .env.example and README-ENQUIRIES.md)
const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export const isConfigured = Boolean(ENDPOINT && /^https:\/\/formspree\.io\/f\/\w+/.test(ENDPOINT));

/** Error with a `kind` the form can react to: config | network | timeout | rejected | server */
export class EnquiryError extends Error {
  constructor(kind, message, fieldErrors = {}) {
    super(message);
    this.kind = kind;
    this.fieldErrors = fieldErrors;
  }
}

const FIELD_MAP = { name: 'name', email: 'email', project_type: 'type', message: 'message' };

export async function sendEnquiry({ values, typeLabel, project, honeypot = '' }) {
  if (!isConfigured) throw new EnquiryError('config', 'The enquiry form is not connected yet.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        project_type: typeLabel,
        message: values.message.trim(),
        related_project: project ? `${project.name} (${project.slug})` : '',
        _subject: `New enquiry from ${values.name.trim()} (${typeLabel})`,
        _gotcha: honeypot, // spam trap: real visitors leave it empty
      }),
      signal: controller.signal,
    });

    if (res.ok) return true;

    let body = {};
    try { body = await res.json(); } catch { /* non-JSON error body */ }
    if (res.status === 422 || res.status === 400) {
      const fieldErrors = {};
      (body.errors || []).forEach((e) => {
        const f = FIELD_MAP[e.field];
        if (f) fieldErrors[f] = e.message;
      });
      throw new EnquiryError('rejected', body.error || 'Some details were not accepted.', fieldErrors);
    }
    throw new EnquiryError('server', `The server replied with an error (${res.status}).`);
  } catch (err) {
    if (err instanceof EnquiryError) throw err;
    if (err.name === 'AbortError') throw new EnquiryError('timeout', 'The request took too long.');
    throw new EnquiryError('network', 'Could not reach the server.');
  } finally {
    clearTimeout(timeout);
  }
}
