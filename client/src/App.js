import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Chat from "./Chat";

const socket = io.connect("http://192.168.29.43:3001");

function App() {
  const [text, updateText] = useState([""]);

  const [cursorAtIndex, updateCursorAtIndex] = useState(0);
  console.log("\n\n 🚀 ~ file: App.js:12 ~ App ~ cursorAtIndex", cursorAtIndex);

  useEffect(() => {
    socket.on("recieveCode", (data) => {
      updateText(data);
    });
    refrence.current.focus();
  }, [socket, cursorAtIndex]);

  // const data = useRef([]);
  let refrence = useRef(null);
  // text.map((x) => {
  //   refrence.push(useRef(null));
  // });

  return (
    <>
      {text.map((value, index) => {
        return (
          <div
            style={{
              display: "flex",
              backgroundColor: "black",
              margin: 0,
              padding: 0,
            }}
            key={index}
          >
            <div
              style={{
                width: 40,
                display: "flex",
                justifyContent: "right",
                borderRightWidth: 4,
                borderRightColor: "#c0c0c0",
                borderRightStyle: "solid",
                color: "ghostwhite",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                paddingRight: 5,
              }}
            >
              {index + 1}.
            </div>
            <input
              style={{
                border: 0,
                outline: "none",
                backgroundColor: "black",
                flex: 1,
                color: "white",
                paddingLeft: 10,
              }}
              type={text}
              value={value}
              ref={cursorAtIndex === index ? refrence : void 0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const temp = [...text, ""];
                  updateText(temp);
                  updateCursorAtIndex(index + 1);
                  socket.emit("update_code", temp);
                } else if (e.key === "Backspace" && !text[index]) {
                  if (text.length > 1) {
                    let temp = [
                      ...text.slice(0, index),
                      ...text.slice(index + 1),
                    ];
                    updateCursorAtIndex(index - 1);

                    updateText(temp);
                    socket.emit("update_code", temp);
                  }
                }
              }}
              onChange={(e) => {
                let temp = [
                  ...text.slice(0, index),
                  e.target.value,
                  ...text.slice(index + 1),
                ];
                updateCursorAtIndex(index);
                updateText(temp);
                socket.emit("update_code", temp);
              }}
            />
          </div>
        );
      })}
    </>
  );

  return (
    <textarea
      value={text}
      onChange={(e) => {
        // const data = e.target.value.split("\n").map((x, y) => {

        //   return `${y+1}. ${x}`;
        // });
        // console.log("\n\n 🚀 ~ file: App.js:18 ~ data ~ data", data)

        // updateText(e.target.value);
        // console.log(text.split());
        updateText(e.target.value);
        socket.emit("update_code", e.target.value);
      }}
      style={{ height: 300, width: 300 }}
    />
  );

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
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
