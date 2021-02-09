import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Peer from "simple-peer";

import SideBar from "../Sidebar";
import VideocallWindow from "./videocallWindow";
import { SocketContext } from "../../context/Socket";
import {
  userType,
  allUsersType,
  userID,
  peersType,
  signalType,
  sendSignalPayloadType,
  returnedSignalPayloadType,
  sendPayloadType,
} from "../../../../types";

interface RoomProps {
  allUsers: allUsersType;
  username: string;
  roomID: string;
  userID: string;
}

const Videocall: React.FC<RoomProps> = (props) => {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [peers, setPeers] = useState<peersType[]>([]);
  const [allUsers, setAllUsers] = useState<allUsersType>(props.allUsers);
  const userVideo = useRef<HTMLVideoElement>();
  const peersRef = useRef<peersType[]>([]);

  const createPeer = (
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("SEND_SIGNAL", { userToSignal, callerID, signal });
    });

    return peer;
  };

  const addPeer = (
    incomingSignal: signalType,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("RETURN_SIGNAL", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const sendInvite = (payload: sendPayloadType) => {
    if (payload.sender) socket.emit("SEND_MESSAGE", payload);
  };

  const renderUser = (user: userType) => {
    const payload = {
      content: props.roomID,
      sender: props.username,
      receiver: user.id,
      chatName: user.username,
      isChannel: false,
      type: "invitation",
    };

    return (
      <li
        className="md:mx-0 mx-auto inline-flex"
        key={user.id}
        onClick={() => {
          sendInvite(payload as sendPayloadType);
        }}
      >
        <button
          className={
            "text-gray-800 hover:text-gray-600 text-sm block px-2 py-2 no-underline font-semibold border-transparent"
          }
        >
          <i className="fas fa-user-plus mr-2 text-gray-500 text-base"></i>{" "}
          {user.username}
        </button>
      </li>
    );
  };

  const handleClick = () => {
    history.push("/chat", { username: props.username });
  };

  useEffect(() => {
    const videoConstraints = {
      width: {
        min: 1280,
        max: 1920,
      },
      height: {
        min: 720,
        max: 1080,
      },
    };

    let userMedia: MediaStream;
    // render video for every stream
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        if (userVideo.current) userVideo.current.srcObject = stream;
        userMedia = stream;
        socket.emit("JOIN_ROOM", {
          roomID: props.roomID,
          username: props.username,
        });

        socket.on("CONNECTED_USERS", (allUsers: allUsersType) => {
          setAllUsers(allUsers);
        });

        // create a new peer for every user in the room
        socket.on("USERS_IN_ROOM", (users: userID[]) => {
          const peers: peersType[] = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peerID: userID,
              peer,
            });
          });
          setPeers(peers);
        });

        // add a new peer for the newly joined user
        socket.on("USER_JOINED_ROOM", (payload: sendSignalPayloadType) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peer,
            peerID: payload.callerID,
          });
          const peerObj = {
            peer,
            peerID: payload.callerID,
          };
          setPeers((users) => [...users, peerObj]);
        });

        socket.on(
          "RECEIVED_RETURN_SIGNAL",
          (payload: returnedSignalPayloadType) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item?.peer.signal(payload.signal);
          }
        );

        // remove peer when user leaves the room
        socket.on("USER_LEFT_ROOM", (id: string) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();

            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = peers;
            setPeers(peers);
          }
        });
      });

    return () => {
      userMedia?.getTracks().forEach((track) => {
        track.stop();
      });
      socket.emit("LEAVE_ROOM");
      socket.off("CONNECTED_USERS");
      socket.off("USERS_IN_ROOM");
      socket.off("USER_JOINED_ROOM");
      socket.off("RECEIVED_RETURN_SIGNAL");
      socket.off("USER_LEFT_ROOM");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  type HeadingProps = {
    text: string;
  };

  const Heading = ({ text }: HeadingProps) => (
    <h6 className="md:min-w-full text-gray-600 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
      {text}
    </h6>
  );

  const Divider = () => <hr className="my-4 md:min-w-full" />;

  return (
    <>
      <SideBar selectedChat={props.roomID}>
        <Heading text={"Invite Users"} />
        {/* Users */}
        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
          {allUsers.filter((u) => u.id !== props.userID).map(renderUser)}
        </ul>
        <Divider />
        {/* Leave videocall button */}
        <Heading text={"Video Call"} />
        <button
          className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded px-4 py-3 shadow-lg"
          onClick={handleClick}
        >
          Leave Call
        </button>
      </SideBar>

      {/* Videocall */}
      <VideocallWindow peers={peers} userVideo={userVideo} />
    </>
  );
};

export default Videocall;
