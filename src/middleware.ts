import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ✅ Exact public routes (pa itilize startsWith)
const publicExactRoutes = [
  "/",
  "/dashboard/signin",
  "/dashboard/signup",
  "/dashboard/unauthorized", // ✅ AJOUTE SA
  "/dashboard/recovery",
  "/dashboard/verifyotp",
  "/dashboard/changepwrd",
  "/dashboard/suivi",
  "/dashboard/reset-password"
];

// ✅ Routes ki ka gen children
const publicPrefixRoutes = [
    '/about',
    '/contact',
    '/confidentialite',
    '/condition',
    '/marchandise',
    '/privacy',
    '/close-account',
    '/support'
    
]

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname

    // 🔓 PUBLIC EXACT MATCH
    if (publicExactRoutes.includes(path)) {
        return NextResponse.next()
    }

    // 🔓 PUBLIC PREFIX MATCH
    if (publicPrefixRoutes.some(route => path.startsWith(route))) {
        return NextResponse.next()
    }

    // ✅ Skip static files
    if (
        PUBLIC_FILE.test(path) ||       // .svg .png .jpg etc.
        path.startsWith('/_next') ||
        path.startsWith('/images') ||
        path.startsWith('/assets') ||
        path.startsWith('/favicon')
    ) {
        return NextResponse.next()
    }

    // 🔐 SECURITY: this used to read the real JWT from a cookie and decode
    // its "role" claim with jwtDecode to route CLIENT/AGENT away from pages
    // they shouldn't see. jwtDecode never verifies a JWT's signature — it
    // just base64-decodes the payload — so that role claim was never
    // actually trustworthy here; anyone could hand-craft a cookie claiming
    // role "ADMIN" and get past this check. It didn't expose real data
    // (every API call is separately, correctly authorized by the backend
    // using a signature-verified token), but it wasn't providing the
    // protection it looked like it was providing either.
    //
    // Per-role page redirects already happen client-side in
    // app/dashboard/(template2)/admin/(admin)/layout.tsx, using the token
    // from an authenticated session in localStorage — that's the real
    // routing gate. This middleware now only answers a coarser, safe
    // question: is there an active session at all. `vlx_session` carries
    // no claims, just a flag set by AuthContext.login() — nothing here to
    // forge that would grant any actual capability.
    const hasSession = request.cookies.get('vlx_session')?.value === '1'

    if (!hasSession) {
        return NextResponse.redirect(new URL('/dashboard/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next).*)'],
}
