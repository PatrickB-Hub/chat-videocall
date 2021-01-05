import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Peer from "simple-peer";

import Video from "../components/Video"
import { SocketContext } from "../context/Socket";
import {
  userType,
  allUsersType,
  userID,
  peersType,
  signalType,
  sendSignalPayloadType,
  returnedSignalPayloadType,
  sendPayloadType,
} from "../../../types";

interface RoomProps {
  location: any;
  match: any;
}

const Room: React.FC<RoomProps> = (props) => {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [peers, setPeers] = useState<peersType[]>([]);
  const [allUsers, setAllUsers] = useState<allUsersType>(
    props?.location?.state?.allUsers || []
  );
  const userVideo = useRef<HTMLVideoElement>();
  const peersRef = useRef<peersType[]>([]);
  const roomID: string = props.match.params.roomID;
  const state: { username: string; yourID: string } | undefined =
    props.location.state;

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
    console.log("user id", user.id, "your id", state?.yourID);

    const payload = {
      content: roomID,
      sender: state && state.username,
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
    history.push("/chat", { username: state?.username });
  };

  const copyToClipboard = () => {
    //the text that is to be copied to the clipboard
    const URL = document.location.href;

    //create our hidden div element
    const hiddenCopy = document.createElement("div");
    //set the innerHTML of the div
    hiddenCopy.innerHTML = URL;
    //set the position to be absolute and off the screen
    hiddenCopy.style.position = "absolute";
    hiddenCopy.style.left = "-9999px";

    //check and see if the user had a text selection range
    let currentRange;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      //the user has a text selection range, store it
      currentRange = selection.getRangeAt(0);
      //remove the current selection
      selection.removeRange(currentRange);
    }

    //append the div to the body
    document.body.appendChild(hiddenCopy);
    //create a selection range
    var CopyRange = document.createRange();
    //set the copy range to be the hidden div
    CopyRange.selectNode(hiddenCopy);
    //add the copy range
    selection?.addRange(CopyRange);

    //since not all browsers support this, use a try block
    try {
      //copy the text
      document.execCommand("copy");
    } catch (err) {
      window.alert("Your Browser Doesn't support this! Error : " + err);
    }
    //remove the selection range (Chrome throws a warning if we don't.)
    selection?.removeRange(CopyRange);
    //remove the hidden div
    document.body.removeChild(hiddenCopy);

    //return the old selection range
    if (currentRange) {
      selection?.addRange(currentRange);
    }
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
    // render video tags for every stream
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        if (userVideo.current) userVideo.current.srcObject = stream;
        userMedia = stream;
        socket.emit("JOIN_ROOM", { roomID, username: state?.username });

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
          {/* Selected Channel */}
          <div className="md:hidden sm:inline-block md:pb-2 text-gray-700 mr-4 whitespace-no-wrap text-sm uppercase font-bold p-4 px-0">
            {roomID}
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
              Invite Users
            </h6>
            {/* Users */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              {allUsers.filter((u) => u.id !== state?.yourID).map(renderUser)}
            </ul>
            <hr className="my-4 md:min-w-full" />
            {/* Video Call */}
            <h6 className="md:min-w-full text-gray-600 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
              Video Call
            </h6>
            <button
              className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded px-4 py-3 shadow-lg"
              onClick={handleClick}
            >
              Leave Call
            </button>
          </div>
        </div>
      </nav>

      {/* Video Container */}
      <div
        className="md:fixed md:top-0 md:right-0 md:block p-4 w-full h-full md:w-3/4 lg:w-4/5 bg-gray-200"
        style={{ backgroundImage: "url(../background.png)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 md:gap-3 h-full min-h-screen md:min-h-0">
          {/* Peers Videos */}
          {peers.map((peer, i) => {
            console.log(i, peer);
            return (
              <div
                key={peer.peerID}
                className={
                  peers.length === 1
                    ? "md:col-span-4 md:row-span-3 md:col-start-2"
                    : "md:col-span-2 md:row-span-2"
                }
              >
                <Video peer={peer.peer} />
              </div>
            );
          })}
          {/* Invite users */}
          {peers.length === 0 && (
            <div className="md:col-span-4 md:row-span-2 md:row-start-2 md:pt-0 pt-8 text-center">
              <p className="text-2xl text-gray-800 font-semibold font-">
                Send the{" "}
                <span
                  onClick={copyToClipboard}
                  className="has-tooltip bg-gray-100 rounded px-1 cursor-pointer"
                >
                  <span className="tooltip rounded text-sm shadow-md p-1 bg-gray-100 text-gray-600 -mt-10 transform -translate-x-9">
                    Copy to clipboard
                  </span>
                  URL
                </span>{" "}
                to your friends or click on an active user to invite them.
              </p>
            </div>
          )}
          {/* User Video */}
          <div
            className={
              peers.length > 1
                ? "md:row-span-2" +
                  (peers.length === 2 ? " md:col-span-4" : " md:col-span-2")
                : "md:col-span-1 md:row-span-1 md:row-start-4"
            }
          >
            <video
              className="block mx-auto md:h-full"
              muted
              ref={userVideo as React.LegacyRef<HTMLVideoElement> | undefined}
              autoPlay
              playsInline
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
