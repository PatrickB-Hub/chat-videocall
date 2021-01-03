import React, { useContext, useState, useRef, useEffect } from "react";
import immer from "immer";

import { SocketContext } from "../../context/Socket";
import SideBar from "../Sidebar";
import ChatWindow from "./chatWindow";
import {
  allUsersType,
  currentChatType,
  unreadMessagesType,
  messageType,
  messagesType,
} from "../../../../types";

const initialCurrentChatState = {
  isChannel: true,
  chatName: "general",
  receiverID: "",
};

const initialMessagesState: { [key: string]: messageType[] } = {
  general: [],
  javascript: [],
  random: [],
  jokes: [],
};

interface ChatProps {
  username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
  const socket = useContext(SocketContext);
  const [currentChat, setCurrentChat] = useState<currentChatType>(
    initialCurrentChatState
  );
  const [connectedChats, setConnectedChats] = useState(["general"]);
  const [allUsers, setAllUsers] = useState<allUsersType>([]);
  const [unreadMessages, setUnreadMessages] = useState<unreadMessagesType>({});
  const [messages, setMessages] = useState<messagesType>(initialMessagesState);
  const [message, setMessage] = useState("");
  const selectedChat = useRef("general");

  const sendMessage = () => {
    if (message) {
      const payload = {
        content: message,
        sender: username,
        receiver: currentChat.isChannel
          ? currentChat.chatName
          : currentChat.receiverID,
        chatName: currentChat.chatName,
        isChannel: currentChat.isChannel,
        type: "message",
      };
      socket.emit("SEND_MESSAGE", payload);

      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName].push({
          sender: username,
          content: message,
          type: "message",
        });
      });
      setMessages(newMessages);

      // clear message textarea when the user sends his message
      setMessage("");
    }
  };

  // add message to existing conversation or create a new conversation
  const receiveMessage = ({
    content,
    sender,
    chatName,
    type,
  }: messageType & { chatName: string }) => {
    setMessages((messages) => {
      const newMessages = immer(messages, (draft) => {
        draft[chatName]
          ? draft[chatName].push({ sender, content, type })
          : (draft[chatName] = [{ sender, content, type }]);
      });
      return newMessages;
    });

    if (selectedChat.current !== chatName) {
      setUnreadMessages((unreadMessages) => {
        const newUnreadMessages = immer(unreadMessages, (draft) => {
          draft[chatName] ? (draft[chatName] += 1) : (draft[chatName] = 1);
        });
        return newUnreadMessages;
      });
    }
  };

  // add messages that were send before the user joined the chat
  const chatJoinCallback = (incomingMessages: messageType[], chat: string) => {
    const newMessages = immer(messages, (draft) => {
      draft[chat] = incomingMessages;
    });
    setMessages(newMessages);
  };

  const joinChat = (chat: string) => {
    const newConnectedChats = immer(connectedChats, (draft) => {
      draft.push(chat);
    });

    socket.emit("JOIN_CHAT", chat, (messages: messageType[]) =>
      chatJoinCallback(messages, chat)
    );
    setConnectedChats(newConnectedChats);
  };

  const toggleChat = (currentChat: currentChatType) => {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);

    setUnreadMessages((unreadMessages) => {
      const newUnreadMessages = immer(unreadMessages, (draft) => {
        draft[currentChat.chatName] = 0;
      });
      return newUnreadMessages;
    });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // reconnect users that come back from a video call
  useEffect(() => {
    socket.on("CONNECTED_USERS", (allUsers: allUsersType) => {
      setAllUsers(allUsers);
    });
    socket.emit("JOIN_SERVER", username);
    socket.emit("JOIN_CHAT", "general", (messages: messageType[]) =>
      chatJoinCallback(messages, "general")
    );
    socket.on("RECEIVED_MESSAGE", receiveMessage);

    return () => {
      socket.emit("LEAVE_SERVER");
      socket.off("CONNECTED_USERS");
      socket.off("RECEIVED_MESSAGE");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SideBar
        username={username}
        yourID={socket ? socket.id : ""}
        allUsers={allUsers}
        joinChat={joinChat}
        selectedChat={selectedChat}
        toggleChat={toggleChat}
        connectedChats={connectedChats}
        unreadMessages={unreadMessages}
      />
      <div
        className="right-0 md:block fixed md:top-0 top-12 bottom-0 w-full md:w-3/4 lg:w-4/5 bg-gray-200"
        style={{ backgroundImage: "url(background.png)" }}
      >
        <ChatWindow
          username={username}
          yourID={socket ? socket.id : ""}
          message={message}
          handleMessageChange={handleMessageChange}
          sendMessage={sendMessage}
          messages={messages[currentChat.chatName]}
        />
      </div>
    </>
  );
};

export default Chat;
