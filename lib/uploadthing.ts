import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

/**
 * A type-safe upload button component generated from the application's file router.
 * Renders a button that opens a file picker for uploading files.
 *
 * @see https://docs.uploadthing.com/api-reference/react#generateuploadbutton
 */
export const UploadButton = generateUploadButton<OurFileRouter>();

/**
 * A type-safe upload dropzone component generated from the application's file router.
 * Renders a drag-and-drop area for uploading files.
 *
 * @see https://docs.uploadthing.com/api-reference/react#generateuploaddropzone
 */
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

/**
 * A type-safe uploader component generated from the application's file router.
 * A headless uploader that combines button and dropzone functionality.
 *
 * @see https://docs.uploadthing.com/api-reference/react#generateuploader
 */
export const Uploader = generateUploader<OurFileRouter>();
