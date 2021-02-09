import React, { useRef, useEffect } from "react";

import Message from "./message";
import { messageType } from "../../../../types";

interface ChatWindowProps {
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage: () => void;
  username: string;
  userID: string;
  message: string;
  messages: messageType[];
}

const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const chatContainer = useRef<HTMLDivElement>();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.sendMessage();
    }
  };

  // scroll to bottom when new message is rendered
  useEffect(() => {
    if (chatContainer) {
      chatContainer?.current?.addEventListener(
        "DOMNodeInserted",
        (event: any) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        }
      );
    }
  }, []);

  return (
    <div
      className="right-0 md:block fixed md:top-0 top-12 bottom-0 w-full md:w-3/4 lg:w-4/5 bg-gray-200"
      style={{ backgroundImage: "url(background.png)" }}
    >
      <div className="w-full h-full flex flex-col">
        <div
          className="flex-auto overflow-y-auto p-5 space-y-8"
          ref={chatContainer as React.LegacyRef<HTMLDivElement> | undefined}
        >
          {props.messages.map((message, index) => (
            <div key={index}>
              <Message
                username={props.username}
                userID={props.userID}
                message={message}
              />
            </div>
          ))}
        </div>

        <div className="flex-none flex h-20 p-4 pt-0 shadow-2xl">
          <textarea
            className="h-full w-full outline-none border focus:border-purple-400 hover:border-purple-300 rounded p-4 shadow-lg"
            value={props.message}
            onKeyPress={handleKeyPress}
            onChange={props.handleMessageChange}
            placeholder="Type a message..."
          ></textarea>
          <button
            className="w-32 bg-pink-400 focus:outline-none hover:bg-pink-500 text-white text-center font-semibold rounded px-4 py-3 mx-2 shadow-lg"
            onClick={() => props.sendMessage()}
          >
            <i className="fas fa-paper-plane mr-2 text-white"></i> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
