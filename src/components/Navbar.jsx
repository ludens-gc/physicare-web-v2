import { Box, Button, Flex, Divider } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Flex
      h={"40px"}
      align="center"
      justify="space-between"
      bg="blue.700"
      color="white"
    >
      <Box marginLeft={2}>Logo</Box>
      <Box display={{ base: "none", md: "block" }}>
        <Flex direction="row" alignItems={"center"}>
          <Box
            px={2}
            py={2}
            _hover={{
              textDecoration: "none",
              bg: "blue.600",
            }}
          >
            <Link to="/">Home</Link>
          </Box>
          <Box
            px={2}
            py={2}
            _hover={{
              textDecoration: "none",
              bg: "blue.600",
            }}
          >
            <Link to="/chats">Chats</Link>
          </Box>
          <Link to="/search">
            <Box
              px={2}
              py={2}
              _hover={{
                textDecoration: "none",
                bg: "blue.600",
              }}
            >
              Search
            </Box>
          </Link>
          <Divider orientation="vertical" mx={4} />
          <Flex marginRight={2} direction="row" gap={1} alignItems={"center"}>
            <Button
              size="sm"
              backgroundColor="blue.400"
              color="white"
              _hover={{
                bg: "blue.600",
              }}
              onClick={() => {
                console.log("Click");
                signOut(auth);
                navigate("/signin");
              }}
            >
              Sign Out
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Navbar;
