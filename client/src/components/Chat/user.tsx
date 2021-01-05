import {
  userType,
  currentChatType,
  unreadMessagesType,
} from "../../../../types";

interface UserProps {
  user: userType;
  selectedChat: string;
  unreadMessages: unreadMessagesType;
  handleClick: (currentChat: currentChatType, isChannel: boolean) => void;
}

const User: React.FC<UserProps> = ({
  user,
  selectedChat,
  unreadMessages,
  handleClick,
}) => {
  const currentChat = {
    chatName: user.username,
    isChannel: false,
    receiverID: user.id,
  };

  return (
    <li
      className="md:mx-0 mx-auto inline-flex"
      key={user.id}
      onClick={() => handleClick(currentChat, false)}
    >
      <button
        className={
          "text-gray-800 hover:text-gray-600 text-sm block px-2 py-2 no-underline font-semibold border-transparent" +
          (user.username === selectedChat
            ? " text-pink-500 hover:text-pink-600"
            : "")
        }
      >
        <span className="flex items-center space-x-1">
          <i className="fas fa-comments mr-1 text-gray-500 text-base"></i>
          <span>{user.username}</span>
          {unreadMessages.hasOwnProperty(user.username) &&
            unreadMessages[user.username] > 0 && (
              <span className="bg-pink-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {unreadMessages[user.username] > 9
                  ? "9+"
                  : unreadMessages[user.username]}
              </span>
            )}
        </span>
      </button>
    </li>
  );
};

export default User;
