import { AttachmentIcon } from "@chakra-ui/icons";
import { Input, Button, Flex, IconButton } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { firestore, storage } from "../lib/firebaseConfig";

const InputMessage = () => {
  let [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [invalidInput, setInvalidInput] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (text === "" && !img) {
      return setInvalidInput(true);
    }
    if (img) {
      if (text === "") {
        text = "Image";
      }
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(firestore, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        },
      );
    } else {
      await updateDoc(doc(firestore, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(firestore, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(firestore, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <Flex direction={"row"} bg={"gray.100"} p={"8px"}>
      <Input
        bg={"white"}
        placeholder="Type your message..."
        onChange={(e) => {
          setText(e.target.value);
          if (invalidInput) {
            setInvalidInput(false);
          }
        }}
        isInvalid={invalidInput}
        value={text}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSend();
          }
        }}
      />
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        onChange={(e) => {
          console.log("here");
          const file = e.target.files[0];
          const reader = new FileReader();
          if (file) {
            reader.readAsDataURL(file);
          }
          setImg(file);
        }}
      />
      <IconButton
        backgroundColor={img ? "green.400" : "blue.400"}
        color="white"
        ml={2}
        _hover={{
          bg: "blue.600",
        }}
        aria-label="Send Image"
        icon={<AttachmentIcon />}
        onClick={() => document.getElementById("imageUpload").click()}
      />
      <Button
        backgroundColor="blue.400"
        ml={2}
        color="white"
        _hover={{
          bg: "blue.600",
        }}
        onClick={handleSend}
      >
        Send
      </Button>
    </Flex>
  );
};

export default InputMessage;
