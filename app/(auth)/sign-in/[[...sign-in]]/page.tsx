/**
 * @file app/(auth)/sign-in/[[...sign-in]]/page.tsx
 * @description Sign-in page for the NexusLive application.
 *
 * Renders Clerk's pre-built SignIn component, which provides a complete
 * authentication UI including:
 * - Email/password authentication
 * - Social OAuth provider buttons (as configured in Clerk Dashboard)
 * - Multi-factor authentication support
 * - Password reset flow initiation
 * - Automatic redirect handling post sign-in
 *
 * The page uses Next.js catch-all routing (`[[...sign-in]]`) to support
 * Clerk's multi-step authentication flows, which require multiple
 * sub-routes for complete functionality.
 *
 * @module SignInPage
 * @requires @clerk/nextjs
 *
 * @see {@link https://clerk.com/docs/components/authentication/sign-in} Clerk SignIn Component
 */

import type { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";

/**
 * Metadata for the Sign In page.
 */
export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NexusLive account to watch streams and join the community chat.",
};

/**
 * SignInPage component that renders the Clerk authentication sign-in form.
 *
 * Delegates all authentication UI and logic to Clerk's managed SignIn
 * component, which handles:
 * - Form state and validation
 * - Authentication API communication
 * - Error messaging and display
 * - Post-authentication redirects (configured via props `fallbackRedirectUrl` /
 *   `forceRedirectUrl` or environment variables `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` /
 *   `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`)
 *
 * Appearance and behavior can be customized via:
 * - Clerk Dashboard theming settings
 * - The `appearance`, `fallbackRedirectUrl`, and `forceRedirectUrl` props on the SignIn component
 * - Environment variables for redirect URLs
 *
 * @component
 * @returns {JSX.Element} The Clerk SignIn component
 *
 * @example
 * // Accessible at: /sign-in
 * // Rendered within AuthLayout for centered display
 */
export default function SignInPage(): React.JSX.Element {
  return <SignIn fallbackRedirectUrl="/" forceRedirectUrl="/" />;
}
