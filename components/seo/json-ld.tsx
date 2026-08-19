/**
 * @file components/seo/json-ld.tsx
 * @description Injects schema.org structured data (JSON-LD) into the document <head>.
 * Provides XSS sanitization by escaping angle brackets.
 *
 * @module components/seo/json-ld
 */

import React from "react";

interface JsonLdProps {
  /** The structured data schema object following schema.org specifications. */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Renders an XSS-safe `<script type="application/ld+json">` tag.
 *
 * @param {JsonLdProps} props - Component properties containing the JSON-LD data.
 * @returns {React.JSX.Element} A JSON-LD script element.
 */
export function JsonLd({ data }: JsonLdProps): React.JSX.Element {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
