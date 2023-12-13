import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Chats = () => {
  return (
    <Flex direction={"column"} height={"100vh"} w={"100%"}>
      <Navbar />
      <Flex h={"calc(100% - 40px)"}>
        <Flex direction={"column"} shadow="lg" flex={1}>
          <Sidebar />
        </Flex>
        <Box flex={3}>
          <Chat />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Chats;
