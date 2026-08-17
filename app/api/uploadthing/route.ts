import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

/**
 * Creates Next.js route handlers for the UploadThing API.
 * Exports GET and POST handlers required by UploadThing to manage
 * file uploads and retrieve upload configurations.
 *
 * @see https://docs.uploadthing.com/getting-started/appdir#create-a-nextjs-api-route-using-the-filerouter
 */
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
