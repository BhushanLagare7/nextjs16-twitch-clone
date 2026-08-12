/**
 * @file _components/connect-modal.tsx
 * @description Modal dialog for generating a new stream ingress connection.
 *
 * Allows the user to select an ingress type (RTMP or WHIP) and generate
 * a new connection. Displays a warning that generating a new connection
 * will reset all active streams using the current connection.
 */

"use client";

import { AlertTriangleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * ConnectModal - Client component that renders a dialog for generating
 * a new stream ingress connection.
 *
 * Features:
 * - Ingress type selection (RTMP or WHIP)
 * - Warning alert about resetting active streams
 * - Cancel and Generate action buttons
 *
 * @returns {JSX.Element} A dialog modal triggered by a "Generate connection" button.
 */
export function ConnectModal() {
  return (
    <Dialog>
      {/* Button that opens the connection generation dialog */}
      <DialogTrigger asChild>
        <Button variant="primary">Generate connection</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate connection</DialogTitle>
        </DialogHeader>

        {/* Dropdown to select the ingress protocol type */}
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ingress Type" />
          </SelectTrigger>
          <SelectContent>
            {/* Real-Time Messaging Protocol option */}
            <SelectItem value="RTMP">RTMP</SelectItem>
            {/* WebRTC-HTTP Ingress Protocol option */}
            <SelectItem value="WHIP">WHIP</SelectItem>
          </SelectContent>
        </Select>

        {/* Warning: Generating a new connection resets all active streams */}
        <Alert>
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action will reset all active streams using the current
            connection
          </AlertDescription>
        </Alert>

        {/* Dialog action buttons */}
        <div className="flex justify-between">
          {/* Closes the dialog without making any changes */}
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          {/* Triggers the connection generation logic */}
          {/* TODO: Implement the generate connection handler */}
          <Button variant="primary" onClick={() => {}}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
