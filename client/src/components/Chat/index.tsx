import React, { useContext } from "react";

import { SocketContext } from "../../context/Socket";

interface ChatProps {
  username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
  const socket = useContext(SocketContext);

  return (
    <>
      <h1>{username}</h1>
    </>
  );
};

export default Chat;
