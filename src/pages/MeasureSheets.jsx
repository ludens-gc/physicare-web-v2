import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { firestore } from "../lib/firebaseConfig";
import Navbar from "../components/Navbar";

const MeasureSheet = () => {
  const [objetivo, setObjetivo] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [measurements, setMeasurements] = useState([]);
  const [dataMedida, setDataMedida] = useState(new Date());

  const { pacientUid } = useParams();
  //   console.log(pacientUid);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const fichaPerimetriaRef = await addDoc(
        collection(firestore, "fichasPerimetria"),
        {
          pacientUid,
          objetivo,
          altura,
          peso,
          measurements,
          dataMedida,
        }
      );

      console.log(
        "Ficha de perimetria adicionada com sucesso!: ",
        fichaPerimetriaRef.id
      );
    } catch (error) {
      console.error("Erro ao adicionar ficha de perimetria: ", error);
    }

    setObjetivo("");
    setAltura("");
    setPeso("");
    setMeasurements([]);
  };

  const handleInputChange = (measureName, value) => {
    setMeasurements((prevMeasurements) => {
      const updatedMeasurements = [...prevMeasurements];
      const index = updatedMeasurements.findIndex(
        (measure) => measure.measureName === measureName
      );

      if (index !== -1) {
        updatedMeasurements[index].value = value;
      } else {
        updatedMeasurements.push({
          measureName,
          value,
        });
      }

      return updatedMeasurements;
    });
  };

  return (
    <>
    <Navbar/>
      <ChakraProvider>
        <Flex justifyContent={"center"}>
          <Box p={4} minW={"80%"}>
            <FormControl mb={4} maxW={"50%"}>
              <FormLabel>Objetivo</FormLabel>
              <Select
                placeholder="Selecione o objetivo"
                onChange={(e) => setObjetivo(e.target.value)}
              >
                <option value="hipertrofia">Hipertrofia</option>
                <option value="perda-de-peso">Perda de Peso</option>
                <option value="melhoria-de-postura">Melhoria de Postura</option>
                <option value="treino-funcional">Treino Funcional</option>
              </Select>
            </FormControl>

            <FormControl mb={4} maxW={"50%"}>
              <FormLabel>Altura (cm)</FormLabel>
              <Input
                type="number"
                onChange={(e) => setAltura(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4} maxW={"50%"}>
              <FormLabel>Peso (kg)</FormLabel>
              <Input type="number" onChange={(e) => setPeso(e.target.value)} />
            </FormControl>

            <Table variant="striped" colorScheme="blue" size="sm">
              <Thead>
                <Tr>
                  <Th>Perimetria</Th>
                  <Th>Medida (cm)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  "Braço Direito",
                  "Braço Esquerdo",
                  "Antebraço Direito",
                  "Antebraço Esquerdo",
                  "Abdomen",
                  "Cintura",
                  "Quadril",
                  "Coxa Direita",
                  "Coxa Esquerda",
                  "Panturrilha Direita",
                  "Panturrilha Esquerda",
                ].map((measureName) => (
                  <Tr key={measureName}>
                    <Td>{measureName}</Td>
                    <Td>
                      <Input
                        type="number"
                        onChange={(e) =>
                          handleInputChange(measureName, e.target.value)
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Button mt={4} colorScheme="blue" onClick={handleFormSubmit}>
              Salvar
            </Button>
          </Box>
        </Flex>
      </ChakraProvider>
    </>
  );
};

export default MeasureSheet;
