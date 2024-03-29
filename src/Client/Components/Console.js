import React, { useEffect, useState, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import Box from "@mui/material/Box";
import ConsoleRowItem from "./ConsoleRowItem.js";

function Console({ messagesRef, listControlRef }) {
  // to prevent recreating the interval on message update
  const lastMeasuredLength = useRef(0);
  const boxRef = useRef();
  const listRef = useRef();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  lastMeasuredLength.current = messages.length;

  listControlRef.current.scrollToEnd = () => {
    listRef.current.scrollToItem(messages.length - 1, "smart");
  };

  listControlRef.current.search = (filter) => {
    setFilter(filter);
  };

  useEffect(() => {
    // To prevent the renderer from freezing/slowing down,
    // due to the flood of messages, updating 4 times a second.
    const interval = setInterval(() => {
      if (messagesRef.current.length !== lastMeasuredLength.current) {
        setMessages([...messagesRef.current]);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  let messageList = messages;
  if (filter) {
    messageList = messages.filter((msg) => {
      return msg.message.toLowerCase().includes(filter.toLowerCase());
    });
  }

  return (
    <Box
      ref={boxRef}
      sx={{
        width: "100%",
        height: 300,
        bgcolor: "#080716",
        borderRadius: "5px",
        px: 0.5,
      }}
    >
      <List
        ref={listRef}
        height={300}
        width={"100%"}
        itemSize={(index) => {
          const maxWidth = boxRef.current.offsetWidth - 12;
          const maxCharacters = Math.floor(maxWidth / 10);
          const msgLength = messageList[index].message.length;
          const extraLines = Math.ceil(msgLength / maxCharacters) - 1;
          const totalHeight = 40 + extraLines * 24;
          return totalHeight;
        }}
        estimatedItemSize={40}
        itemCount={messageList.length}
        itemData={messageList}
        overscanCount={5}
      >
        {ConsoleRowItem}
      </List>
    </Box>
  );
}

export default Console;
