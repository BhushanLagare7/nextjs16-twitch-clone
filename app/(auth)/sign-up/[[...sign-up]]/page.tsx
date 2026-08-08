/**
 * @file app/(auth)/sign-up/[[...sign-up]]/page.tsx
 * @description Sign-up (registration) page for the NexusLive application.
 *
 * Renders Clerk's pre-built SignUp component, which provides a complete
 * user registration UI including:
 * - Email/password account creation
 * - Social OAuth provider registration (as configured in Clerk Dashboard)
 * - Email verification flow
 * - Terms of service and privacy policy acknowledgment (if configured)
 * - Automatic redirect handling post registration
 *
 * The page uses Next.js catch-all routing (`[[...sign-up]]`) to support
 * Clerk's multi-step registration flows, which require multiple
 * sub-routes (e.g., email verification steps) for complete functionality.
 *
 * @module SignUpPage
 * @requires @clerk/nextjs
 *
 * @see {@link https://clerk.com/docs/components/authentication/sign-up} Clerk SignUp Component
 */

import { SignUp } from "@clerk/nextjs";

/**
 * SignUpPage component that renders the Clerk authentication sign-up form.
 *
 * Delegates all registration UI and logic to Clerk's managed SignUp
 * component, which handles:
 * - Form state and validation
 * - Account creation API communication
 * - Email/phone verification flows
 * - Error messaging and display
 * - Post-registration redirects (configured via props `fallbackRedirectUrl` /
 *   `forceRedirectUrl` or environment variables `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` /
 *   `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`)
 *
 * Appearance and behavior can be customized via:
 * - Clerk Dashboard theming and configuration settings
 * - The `appearance`, `fallbackRedirectUrl`, and `forceRedirectUrl` props on the SignUp component
 * - Environment variables for redirect URLs and allowed identifiers
 *
 * @component
 * @returns {JSX.Element} The Clerk SignUp component
 *
 * @example
 * // Accessible at: /sign-up
 * // Rendered within AuthLayout for centered display
 */
export default function SignUpPage(): React.JSX.Element {
  return <SignUp fallbackRedirectUrl="/" forceRedirectUrl="/" />;
}
