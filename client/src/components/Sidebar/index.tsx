import React, { useState } from "react";

import Channel from "../Chat/channel";
import User from "../Chat/user";
import CreateRoomBtn from "../Video/createRoom";
import {
  allUsersType,
  currentChatType,
  unreadMessagesType,
} from "../../../../types";

const channels = ["general", "javascript", "random", "jokes"];

interface SideBarProps {
  joinChat: (chat: string) => void;
  toggleChat: (currentChat: currentChatType) => void;
  username: string;
  yourID: string;
  allUsers: allUsersType;
  selectedChat: React.MutableRefObject<string>;
  connectedChats: string[];
  unreadMessages: unreadMessagesType;
}

const Sidebar: React.FC<SideBarProps> = (props) => {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [selectedChat, setSelectedChat] = useState("general");

  const handleClick = (currentChat: currentChatType, isChannel: boolean) => {
    props.selectedChat.current = currentChat.chatName;
    if (isChannel && !props.connectedChats.includes(currentChat.chatName)) {
      props.joinChat(currentChat.chatName);
    }
    props.toggleChat(currentChat);
    setSelectedChat(currentChat.chatName);
    setCollapseShow("hidden");
  };

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-1/4 lg:w-1/5 z-10 md:py-4 md:px-6 px-2">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-2 py-2 my-2 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Chat/Room */}
          <div className="md:hidden sm:inline-block md:pb-2 text-gray-700 mr-4 whitespace-no-wrap text-sm uppercase font-bold p-4 px-0">
            {selectedChat}
          </div>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none md:text-left text-center shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
              <div className="text-right">
                <button
                  type="button"
                  className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  onClick={() => setCollapseShow("hidden")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-600 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
              Channels
            </h6>
            {/* Channels */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {channels.map((channel) => (
                <Channel
                  channel={channel}
                  selectedChat={selectedChat}
                  unreadMessages={props.unreadMessages}
                  handleClick={handleClick}
                />
              ))}
            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-600 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
              Users
            </h6>
            {/* Users */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              {props.allUsers
                .filter((u) => u.id !== props.yourID)
                .map((user) => (
                  <User
                    user={user}
                    selectedChat={selectedChat}
                    unreadMessages={props.unreadMessages}
                    handleClick={handleClick}
                  />
                ))}
            </ul>
            <hr className="my-4 md:min-w-full" />
            {/* Video Call */}
            <h6 className="md:min-w-full text-gray-600 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
              Video Call
            </h6>
            <CreateRoomBtn
              username={props.username}
              allUsers={props.allUsers}
              yourID={props.yourID}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
