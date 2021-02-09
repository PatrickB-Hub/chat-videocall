import React from "react";

import Videocall from "../components/Video";

interface RoomProps {
  location: any;
  match: any;
}

const Room: React.FC<RoomProps> = ({ location, match }) => {
  return (
    <Videocall
      allUsers={location.state.users || []}
      username={location.state.username}
      roomID={match.params.roomID}
      userID={location.state.userID}
    />
  );
};

export default Room;
