import { WifiOffIcon } from "lucide-react";

/**
 * Props for the {@link OfflineVideo} component.
 *
 * @interface OfflineVideoProps
 *
 * @property {string} username - Display name of the host, shown in the
 *   "offline" message.
 */
interface OfflineVideoProps {
  username: string;
}

/**
 * Renders a placeholder shown when the host is not currently streaming.
 *
 * @function OfflineVideo
 *
 * @param {OfflineVideoProps} props - Component props.
 *
 * @returns {JSX.Element} An offline indicator with the host's username.
 */
export function OfflineVideo({ username }: OfflineVideoProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <WifiOffIcon className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground">{username} is offline</p>
    </div>
  );
}
