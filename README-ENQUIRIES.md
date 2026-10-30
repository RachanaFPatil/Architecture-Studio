# Receiving enquiries (Formspree setup, about 5 minutes)

1. Create a free account at https://formspree.io and click **New Form**. Name it "Form & Frame enquiries" and set the email address where you want enquiries delivered.
2. Copy the form URL. It looks like `https://formspree.io/f/abcdwxyz`.
3. **Local testing:** copy `.env.example` to `.env` and set `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/abcdwxyz`, then restart `npm run dev`.
4. **Live site (Vercel):** Project > Settings > Environment Variables > add `VITE_FORMSPREE_ENDPOINT` with the same URL > **redeploy** (Vite reads it at build time, so a redeploy is required).
   Netlify: Site configuration > Environment variables, then trigger a new deploy.
5. Submit the live form once. Formspree emails you a confirmation link the first time; click it. Submissions also appear in the Formspree dashboard.

Notes
- The form URL is a public identifier, not a secret. It is kept in an environment variable so it is not committed to the code. Never put a Formspree *API key* in the front end.
- Fields sent: name, email, project_type, message, related_project (when the visitor came from a project page), plus a hidden spam trap.
- Until the variable is set, the form shows "not connected yet" and **never** claims success. Server errors, network failures and timeouts also show an error and keep what the visitor typed.
- Formspree's free plan has a monthly submission limit and spam filtering (enable reCAPTCHA in the Formspree form settings if spam appears).
