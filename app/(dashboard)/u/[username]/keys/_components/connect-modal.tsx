/**
 * @file connect-modal.tsx
 * @module components/ConnectModal
 * @description
 * Client-side modal component that allows a user to generate new
 * streaming connection credentials (RTMP or WHIP) via the
 * {@link createIngress} server action.
 *
 * Generating a new connection will reset any existing active stream
 * connections tied to the current ingress configuration.
 *
 * @requires react
 * @requires livekit-server-sdk
 * @requires lucide-react
 * @requires sonner
 * @requires @/actions/ingress
 * @requires @/components/ui/*
 */

"use client";

import { ComponentRef, useRef, useState, useTransition } from "react";

import { IngressInput } from "livekit-server-sdk";
import { AlertTriangleIcon } from "lucide-react";
import { toast } from "sonner";

import { createIngress } from "@/actions/ingress";
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
 * String representation of the RTMP ingress type enum value.
 * Stored as a string because the `<Select>` component requires
 * string-based option values.
 * @constant {string}
 */
const RTMP = String(IngressInput.RTMP_INPUT);

/**
 * String representation of the WHIP ingress type enum value.
 * @constant {string}
 */
const WHIP = String(IngressInput.WHIP_INPUT);

/**
 * Union type representing the selectable ingress connection types
 * available in the modal's dropdown.
 *
 * @typedef {(typeof RTMP | typeof WHIP)} IngressType
 */
type IngressType = typeof RTMP | typeof WHIP;

/**
 * ConnectModal Component
 *
 * Renders a button that opens a dialog allowing the user to select
 * an ingress protocol (RTMP or WHIP) and generate new streaming
 * connection credentials. On success, the newly generated credentials
 * are persisted server-side and the dialog is automatically closed.
 *
 * @component
 * @returns {JSX.Element} The rendered connect modal, including trigger
 *                         button, dialog content, protocol selector,
 *                         warning alert, and action buttons.
 *
 * @example
 * <ConnectModal />
 */
export function ConnectModal() {
  /**
   * Ref to the dialog's close button, used to programmatically
   * dismiss the modal after a successful ingress creation.
   * @type {React.RefObject<HTMLButtonElement>}
   */
  const closeRef = useRef<ComponentRef<"button">>(null);

  /**
   * React transition state used to track the pending status of the
   * ingress creation request without blocking the UI thread.
   * @type {[boolean, React.TransitionStartFunction]}
   */
  const [isPending, startTransition] = useTransition();

  /**
   * Currently selected ingress type (RTMP or WHIP).
   * Defaults to RTMP.
   * @type {[IngressType, React.Dispatch<React.SetStateAction<IngressType>>]}
   */
  const [ingressType, setIngressType] = useState<IngressType>(RTMP);

  /**
   * Handles form submission when the user clicks "Generate".
   *
   * Wraps the {@link createIngress} server action call in a React
   * transition to avoid blocking UI updates. Displays a success or
   * error toast notification based on the outcome, and closes the
   * dialog automatically on success.
   *
   * @function onSubmit
   * @returns {void}
   */
  const onSubmit = () => {
    startTransition(() => {
      createIngress(parseInt(ingressType))
        .then(() => {
          toast.success("Ingress created");
          // Programmatically trigger the dialog's close button.
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

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

        {/* Dropdown to select the desired ingress protocol */}
        <Select
          disabled={isPending}
          value={ingressType}
          onValueChange={(value) => setIngressType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ingress Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RTMP}>RTMP</SelectItem>
            <SelectItem value={WHIP}>WHIP</SelectItem>
          </SelectContent>
        </Select>

        {/* Warning notifying the user of the destructive side-effect */}
        <Alert>
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action will reset all active streams using the current
            connection
          </AlertDescription>
        </Alert>

        {/* Action buttons: cancel (closes dialog) and submit (generates ingress) */}
        <div className="flex justify-between">
          <DialogClose ref={closeRef} asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button disabled={isPending} variant="primary" onClick={onSubmit}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
