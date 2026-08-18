// Fully env-var driven — no hardcoded production domains here anymore.
// NOTE: Next.js inlines NEXT_PUBLIC_* values at BUILD time, not at server
// start — they must be set in Railway's Variables tab *before* the build
// runs (a redeploy triggers a fresh build, so just setting them and
// redeploying is enough; changing them without a rebuild has no effect).
//
// For local dev against a local backend, set in .env.local (gitignored):
//   NEXT_PUBLIC_API_BASE_URL=http://localhost:9400/api
//   NEXT_PUBLIC_API_IMAGE_URL=http://localhost:9400/uploads/products
const REST_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REST_API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

if (!REST_API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Set it in Railway's Variables tab " +
      "for this frontend service and redeploy (Next.js inlines it at build time)."
  );
}
if (!REST_API_IMAGE_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "NEXT_PUBLIC_API_IMAGE_URL is not set. Set it in Railway's Variables tab " +
      "for this frontend service and redeploy (Next.js inlines it at build time)."
  );
}

// Resolves any value coming back from the API (picture/photo fields, or a
// filename built client-side) into a URL that's actually usable in <img
// src> / <a href>. Already-absolute URLs (bucket-hosted or legacy
// Cloudinary links) are returned as-is; anything else is treated as a bare
// filename and gets REST_API_IMAGE_URL prepended.
//
// REST_API_IMAGE_URL MUST point at the backend's own
// /uploads/products/{filename} redirect route (e.g.
// https://<backend-domain>/uploads/products), NOT directly at the R2
// bucket. Two eras of photos live in the bucket under different key
// prefixes (uploads/products/ for images migrated from the old
// local-disk storage, products/ for everything uploaded since) and only
// the backend route knows how to pick the right one per file. Pointing
// this straight at R2 will only ever resolve one of the two eras.
function resolveFileUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `${REST_API_IMAGE_URL}/${value}`;
}

export default { REST_API_BASE_URL, REST_API_IMAGE_URL, resolveFileUrl }
