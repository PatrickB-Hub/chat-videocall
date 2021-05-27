# [Chat-Videocall](https://chat-videocall.herokuapp.com)

Chat with your friends, join public channels or communicate in private chats. Create and manage Videocalls with up to four participants.

![Chat page](http://patrickbecker.me/static/media/chat-videocall.5f53a8ee.png)

## Features

- Channel Chats (one to many communication)
- Private Chats (one to one communication)
- Videocalls with up to 4 participants
- Uniquely generated URL for each Room
- Peer to Peer
- SocketIO
- WebRTC

## Table of Contents

- [Installing](https://github.com/PatrickB-Hub/chat-videocall/tree/main/README.md#Installing)
- [Running](https://github.com/PatrickB-Hub/chat-videocall/tree/main/README.md#Running)
- [Testing](https://github.com/PatrickB-Hub/chat-videocall/tree/main/README.md#Testing)
- [Technologies](https://github.com/PatrickB-Hub/chat-videocall/tree/main/README.md#Technologies)

## Installing

After you have forked the project and downloaded the code, install the necessary dependencies using [npm](https://docs.npmjs.com/about-npm/) or [yarn](https://yarnpkg.com/getting-started).
Don't forget to install the dependencies in the client folder aswell.

To install the packages through npm, run the command `npm install`

To install the packages through yarn, run the command `yarn add`

NOTE: In the rest of the documentation, you will come across npm being used for running commands. To use yarn in place of npm for the commands, simply substitute npm for yarn. Example, npm start as yarn start. For more help, checkout [migrating from npm](https://classic.yarnpkg.com/en/docs/migrating-from-npm/).

## Running

NOTE: The backend code should be running in order for the frontend to behave correctly.

Run the command `node server.js` to start the server.

Make sure the necessary dependencies are installed, go to the client folder and type the command `npm start`

### Environment Variables

**Server**  
`PORT` - The port used by the http server e.g. `5550`

`PROD` - Boolean, when set to `true` express serves the static files in `/client/build`

## Testing

There are currently no tests. (This would be a great way to contribute!)

## Technologies

- [React](https://www.reactjs.org/) ([Create React App](https://www.create-react-app.dev/))
- [TypeScript](https://www.typescriptlang.org/)
- [Socket.io](https://socket.io/)
- [Tailwind](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
