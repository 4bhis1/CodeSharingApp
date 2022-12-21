import React, { useState, useEffect, useRef } from "react";

const MultiCursor = ({ socket }) => {
  const [text, updateText] = useState([""]);
  const [cursorAtIndex, updateCursorAtIndex] = useState(0);

  useEffect(() => {
    socket.on("recieveCode", (data) => {
      updateCursorAtIndex((index) => {
        updateText((text) => {
          data[index] = text[index];
          return data;
        });

        console.log("Yess rendered");

        return index;
      });
    });
  }, [socket]);

  useEffect(() => {
    refrence.current.focus();
  }, [cursorAtIndex]);

  // if (!setIntervalRef) {
  //   const temp = setInterval(() => {
  //     console.log("Triggered in setInterval", text);
  //     socket.emit("update_code", text);
  //     clearInterval(setIntervalRef);
  //     // updateSetIntervalRef(null)
  //   }, [3000]);
  //   updateSetIntervalRef(temp);
  // }

  // console.log("text", text, setIntervalRef);

  let refrence = useRef(null);
  useEffect(() => {
    let isCancelled = false;

    refrence.current.style.height = "0px";
    const scrollHeight = refrence.current.scrollHeight;
    refrence.current.style.height = scrollHeight + "px";

    const fetchData = async () => {
      console.log("text", text);
      socket.emit("update_code", text);
    };

    const interval = setInterval(fetchData, 3000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [text]);

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
                paddingTop: 5,
                paddingRight: 5,
              }}
            >
              {index + 1}.
            </div>
            <textarea
              style={{
                border: 0,
                outline: "none",
                backgroundColor: "black",
                flex: 1,
                color: "white",
                paddingLeft: 10,
                fontSize: 16,
                resize: "none",
                overflowY: "hidden",
              }}
              type={text}
              value={value}
              ref={cursorAtIndex === index ? refrence : void 0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const temp = [
                    ...text.slice(0, index + 1),
                    "",
                    ...text.slice(index + 1),
                  ];
                  updateText(temp);
                  updateCursorAtIndex(index + 1);
                  socket.emit("update_code", temp);
                } else if (e.key === "Backspace" && !text[index]) {
                  if (value.length < 1 && cursorAtIndex !== 0) {
                    let temp = [
                      ...text.slice(0, index),
                      ...text.slice(index + 1),
                    ];
                    updateCursorAtIndex(index - 1);
                    updateText(temp);
                    socket.emit("update_code", temp);
                  }
                } else if (e.key === "Tab") {
                  e.preventDefault();
                  let temp = [
                    ...text.slice(0, index),
                    e.target.value.substring(0, e.target.selectionStart + 1) +
                      "  " +
                      e.target.value.substring(e.target.selectionStart + 1),
                    ...text.slice(index + 1),
                  ];
                  updateCursorAtIndex(index);
                  updateText(temp);
                  socket.emit("update_code", temp);
                } else if (e.key === "ArrowDown") {
                  if (index !== text.length - 1) updateCursorAtIndex(index + 1);
                } else if (e.key === "ArrowUp") {
                  if (index !== 0) updateCursorAtIndex(index - 1);
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
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "fixed",
          right: 0,
          bottom: 10,
          display: "flex",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            cursor: "pointer",
            marginRight: 10,
            padding: 10,
          }}
          onClick={() => {
            let data = "";
            text.map((x) => {
              data += x + "\n";
            });
            try {
              new Function(data)();
            } catch (err) {
              console.log("Error here ", err);
            }
          }}
        >
          Run
        </div>
        <div
          style={{
            backgroundColor: "white",
            cursor: "pointer",
            marginRight: 10,
            padding: 10,
          }}
          onClick={() => {
            let data = "";
            text.map((x) => {
              data += x + "\n";
            });
            const blob = new Blob([data], {
              type: "text/plain",
            });
            console.log("Yeess Download ", blob);

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "code.js";
            link.href = url;
            link.click();
          }}
        >
          Download
        </div>
      </div>
    </>
  );
};

export default MultiCursor;
