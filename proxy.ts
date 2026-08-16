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
 * Clerk middleware instance that handles authentication for all matched routes.
 *
 * Uses direct `pathname` checks instead of `createRouteMatcher` for optimal performance.
 * - Public routes (/, /api/webhooks, /api/uploadthing, /sign-in, /sign-up) bypass authentication checks.
 * - All other protected routes check authentication state and redirect signed-out users to sign-in.
 *
 * @default
 */
export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Define public routes using standard string matching
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/api/uploadthing") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (!isPublicRoute) {
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
