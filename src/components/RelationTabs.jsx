import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { firestore } from "../lib/firebaseConfig";
import { useNavigate } from "react-router-dom";

const RelationTabs = () => {
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "users", currentUser.uid, "myrequests")),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          console.log(doc.data());
          return doc.data();
        });
        setRequests(data);
      },
    );
    console.log(requests);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "users", currentUser.uid, "myappointments")),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          console.log(doc.data());
          return doc.data();
        });
        setAppointments(data);
      },
    );
    console.log(appointments);

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab>Consultas</Tab>
          <Tab>Solicitações</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableContainer>
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    <Th>Usuário</Th>
                    <Th>Problema</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {appointments.map((appointment) => (
                    <>
                      <Tr>
                        <Td>
                          <Flex align="center">
                            <Avatar
                              size="sm"
                              name={
                                currentUser.role === "professional"
                                  ? appointment?.pacientName
                                  : appointment?.professionalName
                              }
                              src={
                                currentUser.role === "professional"
                                  ? appointment?.pacientAvatar
                                  : appointment?.professionalAvatar
                              }
                              mr={2}
                            />
                            {currentUser.role === "professional"
                              ? appointment?.pacientName
                              : appointment?.professionalName}
                          </Flex>
                        </Td>
                        <Td>{appointment?.problem}</Td>
                        <Td>
                          <Button
                            colorScheme="blue"
                            mr={2}
                            onClick={() => {
                              navigate(
                                `/profile/${
                                  currentUser.role === "professional"
                                    ? appointment?.pacientUid
                                    : appointment?.professionalUid
                                }`,
                              );
                            }}
                          >
                            Ver perfil
                          </Button>
                          <Button
                            colorScheme="yellow"
                            mr={2}
                            onClick={() => {
                              navigate(`/sheets/${appointment?.pacientUid}`);
                            }}
                          >
                            Ver ficha
                          </Button>
                        </Td>
                      </Tr>
                    </>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer>
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    <Th>Usuário</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((request) => (
                    <>
                      <Tr>
                        <Td>
                          <Flex align="center">
                            <Avatar
                              size="sm"
                              name={request?.name}
                              src={request?.avatar}
                              mr={2}
                            />
                            {request?.name}
                          </Flex>
                        </Td>
                        <Td>{request?.status}</Td>
                        <Td>
                          <Button
                            onClick={() => {
                              setSelectedRequest(request);
                              console.log(selectedRequest);
                              onOpen();
                            }}
                            colorScheme="blue"
                            mr={2}
                          >
                            Ver
                          </Button>
                        </Td>
                      </Tr>
                    </>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedRequest?.problem}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">De: {selectedRequest?.from}</Text>
            <Text fontWeight="bold">Para: {selectedRequest?.to}</Text>
            <Text>{selectedRequest?.text}</Text>
          </ModalBody>
          <ModalFooter>
            {currentUser?.role === "professional" ? (
              <>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={async () => {
                    await updateDoc(
                      doc(
                        firestore,
                        "users",
                        currentUser.uid,
                        "myrequests",
                        selectedRequest?.from,
                      ),
                      {
                        status: "rejected",
                      },
                    );
                    await updateDoc(
                      doc(
                        firestore,
                        "users",
                        selectedRequest?.from,
                        "myrequests",
                        currentUser.uid,
                      ),
                      {
                        status: "rejected",
                      },
                    );
                    onClose();
                  }}
                >
                  Recusar
                </Button>
                <Button
                  colorScheme="green"
                  onClick={async () => {
                    await updateDoc(
                      doc(
                        firestore,
                        "users",
                        currentUser.uid,
                        "myrequests",
                        selectedRequest?.from,
                      ),
                      {
                        status: "accepted",
                      },
                    );
                    await updateDoc(
                      doc(
                        firestore,
                        "users",
                        selectedRequest?.from,
                        "myrequests",
                        currentUser.uid,
                      ),
                      {
                        status: "accepted",
                      },
                    );
                    await setDoc(
                      doc(
                        firestore,
                        "users",
                        currentUser.uid,
                        "myappointments",
                        selectedRequest?.from,
                      ),
                      {
                        professionalUid: currentUser.uid,
                        pacientUid: selectedRequest?.from,
                        pacientName: selectedRequest?.name,
                        professionalName: currentUser.name,
                        professionalAvatar: currentUser.avatar,
                        pacientAvatar: selectedRequest?.avatar,
                        problem: selectedRequest?.problem,
                      },
                    ),
                      await setDoc(
                        doc(
                          firestore,
                          "users",
                          selectedRequest?.from,
                          "myappointments",
                          currentUser.uid,
                        ),
                        {
                          professionalUid: currentUser.uid,
                          pacientUid: selectedRequest?.from,
                          pacientName: selectedRequest?.name,
                          professionalName: currentUser.name,
                          professionalAvatar: currentUser.avatar,
                          pacientAvatar: selectedRequest?.avatar,
                          problem: selectedRequest?.problem,
                        },
                      );
                    onClose();
                  }}
                >
                  Aceitar
                </Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RelationTabs;
