// Configurable per environment via NEXT_PUBLIC_* vars, with the current
// production URLs kept as defaults so nothing breaks if they're unset.
// NOTE: Next.js inlines NEXT_PUBLIC_* values at BUILD time, not at server
// start — they must be set in Railway's Variables tab *before* the build
// runs (a redeploy triggers a fresh build, so just setting them and
// redeploying is enough; changing them without a rebuild has no effect).
//
// For local dev against a local backend, set in .env.local (gitignored):
//   NEXT_PUBLIC_API_BASE_URL=http://localhost:9400/api
//   NEXT_PUBLIC_API_IMAGE_URL=http://localhost:9400/uploads/products
const REST_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.velogxpress.com/api";

// This is now only a LEGACY fallback, not "the" image base. Since the
// bucket migration, product/gallery photos are uploaded through
// BucketStorageService and the backend already returns/stores a complete
// URL for them (https://.../api/files/...), and older rows may still hold
// a full Cloudinary URL from before that. Only a bare filename — a
// pre-bucket record, or a facture/label filename built client-side — still
// needs a base URL prepended, and the backend serves those at
// /uploads/products/{filename} (NOT under /api — see the comment on
// ImageController.java for why it kept its original, non-/api path).
const REST_API_IMAGE_URL =
  process.env.NEXT_PUBLIC_API_IMAGE_URL ||
  "https://www.velogxpress.com/uploads/products";

// Resolves any value coming back from the API (picture/photo fields, or a
// filename built client-side) into a URL that's actually usable in <img
// src> / <a href>. Already-absolute URLs (bucket-hosted or legacy
// Cloudinary links) are returned as-is; anything else is treated as a bare
// legacy filename and gets REST_API_IMAGE_URL prepended, exactly like the
// old unconditional concatenation used to do for every value.
function resolveFileUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `${REST_API_IMAGE_URL}/${value}`;
}

export default { REST_API_BASE_URL, REST_API_IMAGE_URL, resolveFileUrl }