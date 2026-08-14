"use client";

import { useEffect, useRef, useState } from "react";

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
 * Renders a live `<video>` element for a connected LiveKit participant,
 * along with hover-revealed volume and fullscreen controls.
 *
 * Attaches the participant's camera/microphone tracks to a local video
 * element, manages volume/mute state, and toggles fullscreen on the
 * wrapping container.
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
  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef?.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  /**
   * Toggles between muted (0) and a default 50% volume.
   */
  const toggleMute = () => {
    const isMuted = volume === 0;

    setVolume(isMuted ? 50 : 0);

    if (videoRef?.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

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
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  /**
   * Syncs local `isFullscreen` state with the browser's fullscreen state.
   * Registered as a `fullscreenchange` listener on `document`.
   */
  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullscreen(isCurrentlyFullscreen);
  };

  const documentRef = useRef(document);
  useEventListener("fullscreenchange", handleFullscreenChange, documentRef);

  // Camera/microphone tracks belonging to this specific participant.
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === participant.identity);

  // Attach the participant's tracks to the video element whenever they change.
  useEffect(() => {
    tracks.forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });
  }, [tracks]);

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
