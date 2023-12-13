import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  deleteField,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { firestore } from "../lib/firebaseConfig";

const Sidebar = () => {
  const [chats, setChats] = useState({});
  const [deleteChatInfo, setDeleteChatInfo] = useState(null);
  const [deleteChat, setDeleteChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getChats = () => {
      console.log("getChats");
      const unsubscribe = onSnapshot(
        doc(firestore, "userChats", currentUser.uid),
        (doc) => {
          console.log("Current data: ", doc.data());
          setChats(doc.data());
        },
      );
      return () => unsubscribe();
    };
    console.log(currentUser.uid);
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const handleDeleteChat = async () => {
    console.log(deleteChat);
    console.log(currentUser.uid);
    try {
      console.log("handleDeleteChat");
      const chatsDocRef = doc(firestore, "chats", deleteChat);
      const userChatDocRef = doc(firestore, "userChats", currentUser.uid);
      await deleteDoc(chatsDocRef);
      await updateDoc(userChatDocRef, {
        [deleteChat]: deleteField(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <Flex
      direction={"column"}
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      overflow={"scroll"}
      h={"100%"}
    >
      <InputGroup bg={"white"} shadow="md">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input borderRadius={0} type="text" placeholder="Search" />
      </InputGroup>
      <List>
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <ListItem
              _hover={{
                bg: "blue.200",
              }}
              p={1}
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <Flex gap={4}>
                <Avatar src={chat[1].userInfo?.photoURL} />
                <Flex align={"center"} justify={"space-between"} w={"100%"}>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="bold">
                      {chat[1].userInfo?.displayName}
                    </Text>
                    <Text>{chat[1].lastMessage?.text}</Text>
                  </VStack>
                  <IconButton
                    variant="outline"
                    colorScheme="blue"
                    aria-label="Call Sage"
                    fontSize="20px"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      setDeleteChat(chat[0]);
                      setDeleteChatInfo(chat[1].userInfo);
                      onOpen();
                    }}
                  />
                </Flex>
              </Flex>
            </ListItem>
          ))}
      </List>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deletar conversa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Deseja mesmo deletar a conversa com{" "}
              <Text fontWeight={"bold"} as={"span"}>
                {deleteChatInfo?.displayName}
              </Text>
              ?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDeleteChat}>
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Sidebar;
