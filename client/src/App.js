import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Chat from "./Chat";
import MultiCursor from "./Components/MultiCursor";
// const urlForServer = require("../../link");
// http://192.168.3.94:3000/
const socket = io.connect("http://192.168.3.94:3001");

function App() {

  return (
    <>
      <MultiCursor socket={socket} />
    </>
  );

  // return (
  //   <textarea
  //     value={text}
  //     onChange={(e) => {
  //       // const data = e.target.value.split("\n").map((x, y) => {

  //       //   return `${y+1}. ${x}`;
  //       // });
  //       // console.log("\n\n 🚀 ~ file: App.js:18 ~ data ~ data", data)

  //       // updateText(e.target.value);
  //       // console.log(text.split());
  //       updateText(e.target.value);
  //       socket.emit("update_code", e.target.value);
  //     }}
  //     style={{ height: 300, width: 300 }}
  //   />
  // );

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    // console.log("\n\n 🚀 ~ file: App.js:140 ~ {text.map ~ e", e);
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
