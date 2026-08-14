import { LoaderIcon } from "lucide-react";

/**
 * Props for the {@link LoadingVideo} component.
 *
 * @interface LoadingVideoProps
 *
 * @property {string} label - Status text displayed below the spinner
 *   (e.g. the current LiveKit connection state).
 */
interface LoadingVideoProps {
  label: string;
}

/**
 * Renders a centered loading placeholder shown while a stream's
 * connection or tracks are not yet available.
 *
 * @function LoadingVideo
 *
 * @param {LoadingVideoProps} props - Component props.
 *
 * @returns {JSX.Element} A spinner with a status label.
 */
export function LoadingVideo({ label }: LoadingVideoProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <LoaderIcon className="size-10 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground capitalize">{label}</p>
    </div>
  );
}
