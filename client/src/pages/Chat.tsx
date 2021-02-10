import React, { useState } from "react";

import Form from "../components/Form";
import Chat from "../components/Chat";

interface ChatRoomProps {
  location: any;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ location }) => {
  const [username, setUsername] = useState(location?.state?.username || "");
  const [connected, setConnected] = useState(location?.state?.username && true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <>
      <div
        className="h-screen bg-gray-200"
        style={{ backgroundImage: "url(background.png)" }}
      >
        {connected ? (
          <Chat username={username} />
        ) : (
          <Form
            username={username}
            onChange={handleChange}
            connect={() => setConnected(true)}
          />
        )}
      </div>
    </>
  );
};

export default ChatRoom;
