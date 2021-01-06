import {
  currentChatType,
  unreadMessagesType,
} from "../../../../types";

interface ChannelProps {
  channel: string;
  selectedChat: string;
  unreadMessages: unreadMessagesType;
  handleClick: (currentChat: currentChatType, isChannel: boolean) => void;
}

const Channel: React.FC<ChannelProps> = ({
  channel,
  selectedChat,
  unreadMessages,
  handleClick,
}) => {
  const currentChat = {
    chatName: channel,
    isChannel: true,
    receiverID: "",
  };

  return (
    <li
      className="md:mx-0 mx-auto items-center"
      key={channel}
      onClick={() => handleClick(currentChat, true)}
    >
      <button
        className={
          "text-gray-800 hover:text-gray-600 text-xs uppercase px-3 py-3 font-bold block border-none" +
          (channel === selectedChat ? " text-pink-500 hover:text-pink-600" : "")
        }
      >
        <span className="flex items-center space-x-1">
          <i className="fas fa-sign-in-alt text-gray-500 mr-1 text-sm"></i>
          <span>{channel}</span>
          {unreadMessages.hasOwnProperty(channel) &&
            unreadMessages[channel] > 0 && (
              <span className="bg-pink-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {unreadMessages[channel] > 9 ? "9+" : unreadMessages[channel]}
              </span>
            )}
        </span>
      </button>
    </li>
  );
};

export default Channel;
