import {
  Avatar,
  Divider,
  Flex,
  HStack,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../lib/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser.role === "professional") {
        const usersCollection = collection(firestore, "pacients");
        const q = query(usersCollection);
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map((doc) => doc.data());
        setUsers(userList);
      } else {
        const usersCollection = collection(firestore, "professionals");
        const q = query(usersCollection);
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map((doc) => doc.data());
        setUsers(userList);
      }
    };

    fetchUsers();
  }, [currentUser.role]);

  return (
    <>
      <Navbar />
      <Flex direction={"column"} p={4}>
        <Heading as="h1" size="2xl">
          Search
        </Heading>
        <SearchBar />
        <List>
          {users.map((user, index) => (
            <>
              <ListItem
                onClick={async () => {
                  navigate(`/profile/${user.uid}`);
                }}
                key={index}
                _hover={{
                  bg: "blue.200",
                }}
                p={2}
              >
                <HStack>
                  <Avatar src={user.avatar} />
                  <VStack align="start">
                    <Text fontWeight="bold">{user.name}</Text>
                    <Text>{user?.speciality}</Text>
                  </VStack>
                </HStack>
              </ListItem>
              <Divider orientation="horizontal" />
            </>
          ))}
        </List>
      </Flex>
    </>
  );
};

export default Search;
