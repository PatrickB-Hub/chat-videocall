import React from "react";

import Videocall from "../components/Video";

interface VideocallRoomProps {
  location: any;
}

const VideocallRoom: React.FC<VideocallRoomProps> = ({ location }) => {
  const roomID = location?.pathname.substring(6);

  return (
    <Videocall
      allUsers={location?.state?.users || []}
      username={location?.state?.username}
      userID={location?.state?.userID}
      roomID={roomID}
    />
  );
};

export default VideocallRoom;
