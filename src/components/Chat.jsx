import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <>
      <Flex p={2} shadow="md" bg={"blue.300"} justify={"space-between"}>
        <Flex gap={2} align={"center"}>
          <Avatar size={"sm"} src={data.user?.photoURL} />
          <Text fontWeight="bold" color="white">
            {data.user?.displayName}
          </Text>
        </Flex>
      </Flex>
      <Box
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
        }}
        overflow={"scroll"}
        height={"calc(100% - 104px)"}
        bg={"gray.200"}
      >
        <Messages />
      </Box>
      <InputMessage />
    </>
  );
};

export default Chat;
