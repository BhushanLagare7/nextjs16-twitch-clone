/**
 * @file lib/uploadthing.ts
 * @description Type-safe UploadThing React components and helpers.
 *
 * Exports generated UploadThing components bound to the application's file router.
 *
 * @module lib/uploadthing
 */

import { generateUploadDropzone } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

/**
 * A type-safe upload dropzone component generated from the application's file router.
 * Renders a drag-and-drop area for uploading files.
 *
 * @see https://docs.uploadthing.com/api-reference/react#generateuploaddropzone
 */
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
