import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "../lib/firebaseConfig";
import UserDisplayInfo from "../components/UserDisplayInfo";
import Navbar from "../components/Navbar";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const params = useParams();
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", params.id),
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    };

    fetchUser();
  }, [params.id]);

  const problemRef = useRef();
  const textRef = useRef();

  const handleChatSelect = async () => {
    setLoading(true);
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    console.log(`combined uid: ${combinedId}`);
    try {
      console.log("here: getting doc");
      const res = await getDoc(doc(firestore, "chats", combinedId));
      if (!res.exists()) {
        console.log("here: setting doc");
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });
        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.name,
            photoURL: user.avatar,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(firestore, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.name,
            photoURL: currentUser.avatar,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      console.log("here: navigating");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate(`/chats`);
    }
  };

  const handleRequest = async () => {
    setLoading(true);
    const problem = problemRef.current.value;
    const text = textRef.current.value;
    await setDoc(
      doc(firestore, "users", currentUser.uid, "myrequests", user.uid),
      {
        problem,
        text,
        status: "pending",
        to: user.uid,
        from: currentUser.uid,
        name: user.name,
        avatar: user.avatar,
      },
    );
    await setDoc(
      doc(firestore, "users", user.uid, "myrequests", currentUser.uid),
      {
        problem,
        text,
        status: "pending",
        to: user.uid,
        from: currentUser.uid,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    );
    problemRef.current.value = "";
    textRef.current.value = "";
    setShow(false);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <UserDisplayInfo userData={user} />
      <Flex
        bg={"blue.100"}
        direction={"row"}
        p={4}
        align={"center"}
        justify={"center"}
      >
        <Button
          bg="white"
          textColor={"black"}
          mr={4}
          onClick={() => handleChatSelect()}
        >
          Enviar mensagem
        </Button>
        <Button onClick={() => setShow(!show)} colorScheme="blue">
          Solicitar atendimento
        </Button>
      </Flex>
      {show ? (
        <Flex
          align={"center"}
          justify={"center"}
          bg={"white"}
          direction={"column"}
          p={4}
          gap={4}
        >
          <Text fontSize="xl" fontWeight={"bold"} mt={4}>
            Solicitação de consulta
          </Text>
          <FormControl id="problem" isRequired>
            <FormLabel>Problema</FormLabel>
            <Input
              placeholder="Diga o problema"
              bg={"white"}
              type="text"
              ref={problemRef}
            />
          </FormControl>
          <FormControl id="text" isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              bg={"white"}
              placeholder="Descreva o problema"
              ref={textRef}
            />
          </FormControl>
          <Button
            onClick={() => handleRequest()}
            w={"40%"}
            isLoading={loading}
            colorScheme="blue"
            size="lg"
            mt={4}
          >
            Enviar solicitação
          </Button>
        </Flex>
      ) : null}
    </>
  );
};

export default Profile;
