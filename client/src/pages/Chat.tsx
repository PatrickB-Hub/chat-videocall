import React, { useState } from "react";

import Form from "../components/Form";
import Chat from "../components/Chat";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

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

export default App;
