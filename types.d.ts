import Peer = require("simple-peer");

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


export type joinRoomType = {
  roomID: string;
  username: string;
}

export type peersType = {
  peerID: string;
  peer: Peer.Instance;
};

export type signalType = string | Peer.SignalData;

export type sendSignalPayloadType = {
  signal: signalType;
  callerID: string;
  userToSignal: string;
};

export type returnedSignalPayloadType = {
  signal: signalType;
  callerID: string;
  id: string;
};

export type sendPayloadType = {
  content: string;
  sender: string;
  receiver: string;
  chatName: string;
  isChannel: boolean;
  type: "message" | "invitation";
};