import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/** Creates an UploadThing instance for defining file routes. */
const f = createUploadthing();

/**
 * Defines the file router for UploadThing, specifying upload routes,
 * their configurations, middleware, and post-upload handlers.
 *
 * @see https://docs.uploadthing.com/file-routes
 */
export const ourFileRouter = {
  /**
   * Route for uploading stream thumbnail images.
   *
   * - Accepts image files up to 4MB, limited to 1 file per upload.
   * - Requires the user to be authenticated (via middleware).
   * - On upload completion, updates the stream's thumbnail URL in the database.
   *
   * @see https://docs.uploadthing.com/file-routes#route-config
   */
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    /**
     * Middleware that runs before the upload begins.
     * Authenticates the current user and passes their data to the upload handler.
     *
     * @throws {Error} If the user is not authenticated.
     * @returns An object containing the authenticated user.
     */
    .middleware(async () => {
      const self = await getSelf();

      return { user: self };
    })
    /**
     * Handler that runs after a file has been successfully uploaded.
     * Updates the stream record in the database with the uploaded thumbnail URL.
     *
     * @param metadata - Contains the data returned from the middleware (e.g., user).
     * @param file - The uploaded file object, including its URL.
     * @returns An object containing the uploaded file's URL.
     */
    .onUploadComplete(async ({ metadata, file }) => {
      await db.stream.update({
        where: {
          userId: metadata.user.id,
        },
        data: {
          thumbnailUrl: file.ufsUrl,
        },
      });

      return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

/** The type of the file router, used to type-safe client-side upload components. */
export type OurFileRouter = typeof ourFileRouter;
