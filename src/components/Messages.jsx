import { Flex } from "@chakra-ui/react";
import Message from "./Message";
import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import { firestore } from "../lib/firebaseConfig";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(firestore, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  return (
    <Flex direction={"column"} p={2}>
      {messages.map((msg) => (
        <Message message={msg} key={msg.id} />
      ))}
    </Flex>
  );
};

export default Messages;
