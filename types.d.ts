export type userType = {
  username: string;
  id: string;
};

export type allUsersType = userType[];

export type currentChatType = {
  isChannel: boolean;
  chatName: string;
  receiverID: string;
};

export type unreadMessagesType = {
  [key: string]: number;
};

export type messageType = {
  sender: string;
  content: string;
  type: "message" | "invitation";
};

export type messagesType = {
  [key: string]: messageType[];
};

export type receiverType = { receiver: string };

export type sendMessageType = currentChatType & messageType & receiverType;

export type userID = string;