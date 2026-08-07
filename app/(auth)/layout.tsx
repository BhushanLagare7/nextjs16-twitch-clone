/**
 * @file app/(auth)/layout.tsx
 * @description Layout component for authentication-related pages.
 *
 * Provides a centered, full-screen layout specifically designed for
 * authentication flows including sign-in and sign-up pages.
 *
 * This layout is scoped to the `(auth)` route group, meaning it applies
 * only to authentication pages without affecting the URL structure.
 * The parentheses in `(auth)` indicate a Next.js route group, which
 * organizes routes without adding path segments.
 *
 * @module AuthLayout
 */

/**
 * AuthLayout component for wrapping authentication pages.
 *
 * Renders a full-screen container that centers its children both
 * horizontally and vertically, providing a consistent and focused
 * UI for authentication flows (sign-in, sign-up, etc.).
 *
 * Layout characteristics:
 * - Occupies the full screen height (`h-screen`)
 * - Centers content using flexbox (`items-center`, `justify-center`)
 * - Creates visual isolation from the main application chrome
 *
 * @component
 * @param {LayoutProps<"/">} props - Layout component props
 * @param {React.ReactNode} props.children - Authentication page content to center
 *
 * @returns {JSX.Element} A full-screen centered container
 *
 * @example
 * // Applied automatically to routes within the (auth) group:
 * // app/(auth)/sign-in/page.tsx → centered by AuthLayout
 * // app/(auth)/sign-up/page.tsx → centered by AuthLayout
 */
export default function AuthLayout({
  children,
}: LayoutProps<"/">): React.JSX.Element {
  return (
    /*
     * Full-screen centering container.
     *
     * Applied classes:
     * - `flex`            : Enables flexbox layout
     * - `h-screen`        : Sets height to 100% of the viewport
     * - `items-center`    : Vertically centers children
     * - `justify-center`  : Horizontally centers children
     */
    <div className="flex h-screen items-center justify-center">{children}</div>
  );
}
