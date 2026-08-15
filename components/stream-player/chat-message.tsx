/**
 * @file components/stream-player/chat-message.tsx
 * @description Renders a single chat message row, including timestamp,
 * author name (color-coded per user), and message text.
 *
 * @module ChatMessage
 */

"use client";

import { ReceivedChatMessage } from "@livekit/components-react";
import { format } from "date-fns";

import { stringToColor } from "@/lib/utils";

/**
 * Props for the {@link ChatMessage} component.
 *
 * @interface ChatMessageProps
 *
 * @property {ReceivedChatMessage} data - The LiveKit chat message payload,
 *   including sender info, timestamp, and message text.
 */
interface ChatMessageProps {
  data: ReceivedChatMessage;
}

/**
 * Renders a single chat message with a timestamp, a deterministically
 * color-coded author name (via {@link stringToColor}), and the message body.
 *
 * @function ChatMessage
 * @param {ChatMessageProps} props - Component props.
 * @returns {JSX.Element} The rendered chat message row.
 */
export function ChatMessage({ data }: ChatMessageProps) {
  const color = stringToColor(data.from?.name ?? "");

  return (
    <div className="flex gap-2 rounded-md p-2 hover:bg-white/5">
      <p className="text-sm text-white/40">{format(data.timestamp, "HH:mm")}</p>
      <div className="flex grow flex-wrap items-baseline gap-1">
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color: color }}>
            {data.from?.name}
          </span>
        </p>
        <p className="text-sm break-all">{data.message}</p>
      </div>
    </div>
  );
}
