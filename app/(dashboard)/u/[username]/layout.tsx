/**
 * @file app/(dashboard)/u/[username]/layout.tsx
 * @description Layout component for the creator dashboard routes.
 *
 * Wraps all pages nested under `/(dashboard)/u/[username]` with the
 * creator-specific navigation bar, sidebar, and content container. Ensures that
 * only the authenticated user matching the URL `username` segment can access
 * these routes by redirecting any unrecognised or unauthorised visitor to the
 * home page.
 *
 * @module CreatorLayout
 */

import { redirect } from "next/navigation";

import { getSelfByUsername } from "@/lib/auth-service";

import { Container } from "./_components/container";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

/**
 * Props for the CreatorLayout component.
 *
 * `params` is a Promise in Next.js App Router dynamic routes,
 * requiring `await` before accessing individual route segments.
 *
 * @interface CreatorLayoutProps
 * @property {Promise<{ username: string }>} params - Dynamic route parameters.
 * @property {string} params.username - The username segment from the URL path,
 *   used to verify the authenticated user's identity.
 * @property {React.ReactNode} children - The nested page content to render
 *   inside the layout.
 */
interface CreatorLayoutProps {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}

/**
 * CreatorLayout component — async server layout for the
 * `/(dashboard)/u/[username]` route group.
 *
 * Responsibilities:
 * 1. Resolves the `username` from the dynamic route params.
 * 2. Retrieves the authenticated user whose username matches the URL segment.
 * 3. Redirects to `/` if no matching authenticated user is found, preventing
 *    unauthorised access to creator dashboard pages.
 * 4. Renders the shared creator UI shell (Navbar, Sidebar, and Container)
 *    around the nested page content.
 *
 * @async
 * @param {CreatorLayoutProps} props - The layout props.
 * @param {Promise<{ username: string }>} props.params - Dynamic route parameters.
 * @param {React.ReactNode} props.children - Nested page content.
 *
 * @returns {Promise<JSX.Element>} The rendered creator layout shell with
 *   nested page content.
 *
 * @example
 * // Navigating to /u/johndoe/dashboard renders this layout
 * // with the dashboard page as `children`, provided johndoe is signed in.
 */
export default async function CreatorLayout({
  params,
  children,
}: CreatorLayoutProps) {
  const { username } = await params;

  // Retrieve the authenticated user matching the URL username segment.
  // Returns null if the current session does not belong to this username.
  const self = await getSelfByUsername(username);

  // Redirect unauthorised visitors to the home page.
  if (!self) {
    redirect("/");
  }

  return (
    <>
      {/* Creator-specific navigation bar rendered at the top of the page. */}
      <Navbar />
      <div className="flex h-full pt-20">
        {/* Collapsible sidebar for creator dashboard navigation. */}
        <Sidebar />
        {/* Main content container — adjusts its left margin based on
            the sidebar's collapsed/expanded state. */}
        <Container>{children}</Container>
      </div>
    </>
  );
}
