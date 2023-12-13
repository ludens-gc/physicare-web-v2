import { Avatar, Flex, Text } from "@chakra-ui/react";

const UserDisplayInfo = ({ userData }) => {
  return (
    <>
      <Flex bg="blue.100" justify="center" align="center" p={4}>
        <Flex
          direction="row"
          gap={4}
          bg={"white"}
          p={8}
          borderRadius={8}
          shadow={"md"}
        >
          <Avatar size="2xl" src={userData?.avatar} />
          <Flex direction="column">
            <Text fontSize="xl">{userData?.name}</Text>
            <Text fontSize="xl">{userData?.email}</Text>
            <Text fontSize="xl">{userData?.speciality}</Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default UserDisplayInfo;
