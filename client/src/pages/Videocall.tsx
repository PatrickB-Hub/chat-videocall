import React from "react";

import Videocall from "../components/Video";

interface VideocallRoomProps {
  location: any;
  match: any;
}

const VideocallRoom: React.FC<VideocallRoomProps> = ({ location, match }) => {
  return (
    <Videocall
      allUsers={location.state.users || []}
      username={location.state.username}
      roomID={match.params.roomID}
      userID={location.state.userID}
    />
  );
};

export default VideocallRoom;
