"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTracks } from "@livekit/components-react";
import { Participant, Track } from "livekit-client";
import { useEventListener } from "usehooks-ts";

import { FullscreenControl } from "./fullscreen-control";
import { VolumeControl } from "./volume-control";

/**
 * Props for the {@link LiveVideo} component.
 *
 * @interface LiveVideoProps
 *
 * @property {Participant} participant - The LiveKit `Participant` (the
 *   host) whose camera and microphone tracks should be attached to the
 *   `<video>` element.
 */
interface LiveVideoProps {
  participant: Participant;
}

/**
 * Applies a 0-100 volume level to a `<video>` element, muting it when the
 * value is `0`.
 *
 * @param {HTMLVideoElement} element - The video element to update.
 * @param {number} value - Volume level, from 0 (muted) to 100 (max).
 */
function applyVolumeToVideo(element: HTMLVideoElement, value: number) {
  element.muted = value === 0;
  element.volume = value * 0.01;
}

/**
 * Renders a live `<video>` element for a connected LiveKit participant,
 * along with hover-revealed volume and fullscreen controls.
 *
 * Attaches the participant's camera/microphone tracks to a local video
 * element, manages volume/mute state, and toggles fullscreen on the
 * wrapping container. Tracks are detached again when they change or when
 * the component unmounts, to avoid leaking media attachments to stale
 * DOM elements.
 *
 * @function LiveVideo
 *
 * @param {LiveVideoProps} props - Component props.
 *
 * @returns {JSX.Element} The live video element with playback controls.
 */
export function LiveVideo({ participant }: LiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0);

  /**
   * Updates the video volume/mute state based on the slider value (0-100).
   *
   * @param {number} value - New volume level, from 0 (muted) to 100 (max).
   */
  const onVolumeChange = useCallback((value: number) => {
    setVolume(+value);
    if (videoRef.current) {
      applyVolumeToVideo(videoRef.current, +value);
    }
  }, []);

  /**
   * Toggles between muted (0) and a default 50% volume.
   */
  const toggleMute = useCallback(() => {
    setVolume((currentVolume) => {
      const nextVolume = currentVolume === 0 ? 50 : 0;
      if (videoRef.current) {
        applyVolumeToVideo(videoRef.current, nextVolume);
      }
      return nextVolume;
    });
  }, []);

  // Start muted by default to comply with browser autoplay policies.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, []);

  /**
   * Enters or exits fullscreen mode on the video wrapper element.
   */
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef.current) {
      wrapperRef.current.requestFullscreen();
    }
  }, [isFullscreen]);

  /**
   * Syncs local `isFullscreen` state with the browser's fullscreen state.
   * Registered as a `fullscreenchange` listener on `document`.
   */
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(document.fullscreenElement !== null);
  }, []);

  const documentRef = useRef(document);
  useEventListener("fullscreenchange", handleFullscreenChange, documentRef);

  // Camera/microphone tracks published by any participant.
  const trackReferences = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]);

  // Tracks belonging to this specific participant. Memoized so the
  // reference is stable across renders that don't affect the underlying
  // track list, reducing unnecessary work downstream.
  const participantTracks = useMemo(
    () =>
      trackReferences.filter(
        (trackRef) => trackRef.participant.identity === participant.identity,
      ),
    [trackReferences, participant.identity],
  );

  // Stable, primitive key representing the current set of track
  // publications. Used as the effect dependency below instead of the
  // `participantTracks` array itself, since `useTracks` returns a new
  // array on every call (e.g. on unrelated re-renders such as volume
  // changes), which would otherwise cause redundant attach/detach cycles.
  const trackSids = participantTracks
    .map((trackRef) => trackRef.publication.trackSid)
    .join(",");

  // Attach the participant's tracks to the video element whenever the
  // actual set of tracks changes, and detach them again on cleanup
  // (i.e. before re-attaching a new set, or on unmount). This prevents
  // tracks from remaining attached to a stale/removed `<video>` element,
  // which would otherwise continue decoding and rendering media in the
  // background, leaking browser and memory resources.
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    participantTracks.forEach((trackRef) => {
      trackRef.publication.track?.attach(element);
    });

    return () => {
      participantTracks.forEach((trackRef) => {
        trackRef.publication.track?.detach(element);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackSids]);

  return (
    <div ref={wrapperRef} className="relative flex h-full">
      <video ref={videoRef} width="100%" />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-linear-to-r from-neutral-900 px-4">
          <VolumeControl
            value={volume}
            onChange={onVolumeChange}
            onToggle={toggleMute}
          />
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
}
