import { useHistory } from "react-router-dom";

import { messageType } from "../../../../types";

interface MessageProps {
  username: string;
  userID: string;
  message: messageType;
}

const Message: React.FC<MessageProps> = ({ username, userID, message }) => {
  const history = useHistory();
  const isUserMessage = username === message.sender;

  const handleClick = (id: string) => {
    history.push(`/room/${id}`, { username, userID });
  };

  interface renderJoinVideoCallMessageProps {
    content: string;
  }

  const renderJoinVideoCallMessage: React.FC<renderJoinVideoCallMessageProps> = ({
    content,
  }) => {
    return (
      <>
        <p>invited you to a Video Call</p>
        <button
          className="bg-purple-400 hover:bg-purple-500 text-white font-semibold rounded mt-2 px-3 py-2 shadow-lg"
          onClick={() => handleClick(content)}
        >
          Join now
        </button>
      </>
    );
  };

  let body;
  if (message.type === "invitation") {
    body = renderJoinVideoCallMessage(message);
  } else {
    body = <p>{message.content}</p>;
  }

  return (
    <div
      className={
        "flex space-x-2" +
        (isUserMessage ? " flex-row-reverse space-x-reverse" : " flex-row")
      }
    >
      <svg
        className="text-gray-700 flex-none w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="shadow-md"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div className="flex flex-col">
        <div
          className={
            "text-gray-800 rounded px-5 py-3 shadow-md" +
            (isUserMessage ? " bg-purple-200" : " bg-pink-200")
          }
        >
          <h4 className="text-gray-700 font-bold">{message.sender}</h4>
          {body}
        </div>
      </div>
    </div>
  );
};

export default Message;
