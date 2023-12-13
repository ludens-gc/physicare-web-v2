import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return message.senderId === currentUser.uid ? (
    <Flex direction={"row-reverse"}>
      <Flex
        ref={ref}
        maxW={"80%"}
        mb={4}
        direction={"column"}
        align={"flex-end"}
      >
        {message.text && (
          <Box
            bg={"blue.200"}
            p={2}
            borderBottomRightRadius="8"
            borderLeftRadius="8"
            mb={1}
            maxW={"max-content"}
          >
            <Text>{message.text}</Text>
          </Box>
        )}
        {message.img && <Image ref={ref} src={message.img} maxW={"50%"} />}
        <Text fontSize={"xs"}>
          {`${message?.date.toDate().toLocaleDateString()} - ${message?.date
            .toDate()
            .toLocaleTimeString()}`}
        </Text>
      </Flex>
    </Flex>
  ) : (
    <Flex>
      <Flex ref={ref} maxW={"80%"} mb={4} direction={"column"}>
        <Box
          bg={"white"}
          p={2}
          borderBottomLeftRadius="8"
          borderRightRadius="8"
          mb={1}
          maxW={"max-content"}
        >
          <Text>{message.text}</Text>
        </Box>
        {message.img && <Image ref={ref} src={message.img} maxW={"50%"} />}
        <Text fontSize={"xs"}>
          {`${message?.date.toDate().toLocaleDateString()} - ${message?.date
            .toDate()
            .toLocaleTimeString()}`}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Message;
