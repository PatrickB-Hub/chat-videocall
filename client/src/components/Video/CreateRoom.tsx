import React from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";

import { allUsersType } from "../../../../types";

interface CreateRoomProps {
  username: string;
  allUsers: allUsersType;
  userID: string;
}

const CreateRoom: React.FC<CreateRoomProps> = ({
  username,
  allUsers,
  userID,
}) => {
  const history = useHistory();

  const create = () => {
    const id = uuid();
    history.push(`/room/${id}`, {
      users: allUsers,
      username,
      userID,
    });
  };

  return (
    <button
      className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded px-4 py-3 shadow-lg"
      onClick={create}
    >
      Create Room
    </button>
  );
};

export default CreateRoom;
