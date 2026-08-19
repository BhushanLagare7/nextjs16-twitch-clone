/**
 * @file proxy.ts
 * @description Clerk authentication middleware configuration for Next.js application.
 *
 * This middleware integrates Clerk's authentication into the Next.js request pipeline,
 * protecting routes and handling authentication state across the application.
 *
 * The middleware intercepts incoming requests and applies Clerk's authentication
 * logic before they reach the application's route handlers.
 *
 * @module middleware
 * @requires @clerk/nextjs/server
 */

import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Checks whether the incoming pathname matches a public route.
 *
 * Public routes:
 * - Root path: `/`
 * - Webhooks: `/api/webhooks` and nested paths
 * - UploadThing: `/api/uploadthing` and nested paths
 * - Authentication: `/sign-in`, `/sign-up` and nested paths
 * - Search: `/search` and nested paths
 * - Dynamic user stream pages: `/:username` (single-segment root path)
 */
export const isPublicRoute = (pathname: string): boolean => {
  if (
    pathname === "/" ||
    pathname === "/api/webhooks" ||
    pathname.startsWith("/api/webhooks/") ||
    pathname === "/api/uploadthing" ||
    pathname.startsWith("/api/uploadthing/") ||
    pathname === "/sign-in" ||
    pathname.startsWith("/sign-in/") ||
    pathname === "/sign-up" ||
    pathname.startsWith("/sign-up/") ||
    pathname === "/search" ||
    pathname.startsWith("/search/")
  ) {
    return true;
  }

  /**
   * Reserved root-level segments that require authentication.
   * These MUST be excluded from the /:username public-route fallback.
   */
  const PROTECTED_ROOT_SEGMENTS = new Set(["u"]);

  // Matches single root-level dynamic route "/:username" (e.g. "/ninja", but not "/u/ninja" or nested paths)
  if (/^\/[^/]+$/.test(pathname)) {
    const segment = pathname.slice(1);
    return !PROTECTED_ROOT_SEGMENTS.has(segment);
  }

  return false;
};

/**
 * Clerk middleware instance that handles authentication for all matched routes.
 *
 * - Public routes (/, /api/webhooks, /api/uploadthing, /:username, /sign-in, /sign-up, /search) bypass authentication checks.
 * - All other protected routes check authentication state and redirect signed-out users to sign-in.
 *
 * @default
 */
export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (!isPublicRoute(pathname)) {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
      return redirectToSignIn();
    }
  }
});

/**
 * Next.js middleware route matcher configuration.
 *
 * Defines which routes the Clerk middleware should intercept and process.
 * Uses Next.js matcher patterns to precisely control middleware execution scope.
 *
 * @type {Object} config
 * @property {string[]} matcher - Array of route patterns for middleware execution
 *
 * @example
 * // The middleware will run on:
 * // - All application routes (excluding static assets and Next.js internals)
 * // - Clerk's auto-proxy path (/__clerk/*)
 * // - All API and tRPC routes (/api/* and /trpc/*)
 */
export const config = {
  matcher: [
    /**
     * Primary application route matcher.
     *
     * Matches all routes EXCEPT:
     * - Next.js internal routes (_next/*)
     * - Static files with specific extensions unless they appear in search params:
     *   - Documents : .html, .htm
     *   - Styles    : .css
     *   - Scripts   : .js (but NOT .json)
     *   - Images    : .jpeg, .jpg, .webp, .png, .gif, .svg
     *   - Fonts     : .ttf, .woff, .woff2
     *   - Other     : .ico, .csv, .docx, .doc, .xlsx, .xls, .zip, .webmanifest
     *
     * @pattern "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    /**
     * Clerk auto-proxy path matcher.
     *
     * Always runs the middleware for Clerk's internal proxy routes,
     * which are used for authentication flows and session management
     * when Clerk operates in proxy mode.
     *
     * @pattern "/__clerk/:path*"
     */
    "/__clerk/:path*",

    /**
     * API route matcher.
     *
     * Always runs the middleware for API and tRPC routes to ensure
     * proper authentication handling for backend endpoints,
     * regardless of any static file exclusions.
     *
     * @pattern "/(api|trpc)(.*)"
     */
    "/(api|trpc)(.*)",
  ],
};
