import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";

import InviteUserText from "./inviteUserText";
import { peersType } from "../../../../types";

interface VideoProps {
  peer: Peer.Instance;
}

const Video: React.FC<VideoProps> = ({ peer }) => {
  const ref = useRef<HTMLVideoElement>();

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      className="block"
      autoPlay
      playsInline
      ref={ref as React.LegacyRef<HTMLVideoElement> | undefined}
    />
  );
};

interface VideocallWindowProps {
  peers: peersType[];
  userVideo: React.MutableRefObject<HTMLVideoElement | undefined>;
}

const VideocallWindow: React.FC<VideocallWindowProps> = ({
  peers,
  userVideo,
}) => {
  return (
    <div
      className="md:fixed md:top-0 md:right-0 md:block p-4 w-full h-full md:w-3/4 lg:w-4/5 bg-gray-200"
      style={{ backgroundImage: "url(../background.png)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 md:gap-3 h-full min-h-screen md:min-h-0">
        {/* Peers Videos */}
        {peers.map((peer) => {
          return (
            <div
              key={peer.peerID}
              className={
                peers.length === 1
                  ? "md:col-span-4 md:row-span-3 md:col-start-2"
                  : "md:col-span-2 md:row-span-2"
              }
            >
              <Video peer={peer.peer} />
            </div>
          );
        })}
        {/* Invite user text */}
        {peers.length === 0 && <InviteUserText />}
        {/* User Video */}
        <div
          className={
            peers.length > 1
              ? "md:row-span-2" +
                (peers.length === 2 ? " md:col-span-4" : " md:col-span-2")
              : "md:col-span-1 md:row-span-1 md:row-start-4"
          }
        >
          <video
            className="block mx-auto md:h-full"
            muted
            ref={userVideo as React.LegacyRef<HTMLVideoElement> | undefined}
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );
};

export default VideocallWindow;
