/**
 * @file app/(dashboard)/u/[username]/(home)/loading.tsx
 * @description Next.js `loading.tsx` route file for the creator stream
 * page. Rendered automatically as a Suspense fallback while the page's
 * server data is being fetched.
 *
 * @module CreatorLoading
 */

import { StreamPlayerSkeleton } from "@/components/stream-player";

/**
 * Loading fallback for the creator stream route. Shows a skeleton version
 * of the stream player so layout doesn't shift once real data arrives.
 *
 * @function CreatorLoading
 * @returns {JSX.Element} The loading skeleton UI.
 */
export default function CreatorLoading() {
  return (
    <div className="h-full">
      <StreamPlayerSkeleton />
    </div>
  );
}
