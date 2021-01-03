import React, { useEffect, useRef } from "react";
import { Instance } from "simple-peer";

interface VideoProps {
  peer: Instance;
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

export default Video;
