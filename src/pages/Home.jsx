import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import RelationTabs from "../components/RelationTabs";
import SearchBar from "../components/SearchBar";
import UserDisplayInfo from "../components/UserDisplayInfo";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <>
      <Navbar />
      <UserDisplayInfo userData={currentUser} />
      <Box w={"85%"} mx="auto" my={4}>
        <SearchBar />
        <RelationTabs />
      </Box>
    </>
  );
};

export default Home;
