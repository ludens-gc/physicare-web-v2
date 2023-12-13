import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Heading,
  CheckboxGroup,
  VStack,
  Checkbox,
} from "@chakra-ui/react";
import { addDoc, collection, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { firestore } from "../lib/firebaseConfig";
import Navbar from "../components/Navbar";

const ExerciseSheet = () => {
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseData, setExerciseData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const {pacientUid} = useParams();
//   console.log(pacientUid);


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const fichaTreinoRef = await addDoc(collection(firestore, 'fichasTreino'), {
        pacientUid: pacientUid,
        exerciseData: exerciseData,
        conditions: selectedOptions
      })

      console.log("Ficha de treino adicionada com sucesso!: ", fichaTreinoRef.id);
    } catch (error) {
      console.error("Erro ao adicionar ficha: ", error)
    }
    console.log(exerciseData);

    setExerciseType("");
    setExerciseData([]);
  };

  const exercicios = [
    { id: 1, nome: "Agachamento", tipo: "forca" },
    { id: 2, nome: "Levantamento Terra", tipo: "forca" },
    { id: 3, nome: "Supino", tipo: "forca" },
    { id: 4, nome: "Remada", tipo: "forca" },
    { id: 5, nome: "Flexão", tipo: "forca" },
    { id: 6, nome: "Corrida", tipo: "cardio" },
    { id: 7, nome: "Ciclismo", tipo: "cardio" },
    { id: 8, nome: "Pular Corda", tipo: "cardio" },
    { id: 9, nome: "Natação", tipo: "cardio" },
    { id: 10, nome: "Aeróbica", tipo: "cardio" },
    { id: 11, nome: "Alongamento de Pernas", tipo: "flexibilidade" },
    { id: 12, nome: "Torção da Coluna", tipo: "flexibilidade" },
    { id: 13, nome: "Flexão Frontal", tipo: "flexibilidade" },
    { id: 14, nome: "Yoga", tipo: "flexibilidade" },
    { id: 15, nome: "Alongamento de Ombros", tipo: "flexibilidade" },
  ];

  const handleInputChange = (exercicioId, campo, valor) => {
    const newExerciseData = [...exerciseData];
    const exerciseIndex = newExerciseData.findIndex(
      (exercicio) => exercicio.id === exercicioId
    );
  
    if (exerciseIndex !== -1) {
      newExerciseData[exerciseIndex][campo] = valor;
    } else {
      newExerciseData.push({
        id: exercicioId,
        exerciseType: exerciseType,
        [campo]: valor,
      });
    }
    setExerciseData(newExerciseData);
  };

  const handleCheckboxChange = (selected) => {
    setSelectedOptions(selected);
  };

  const opcoesSaude = [
    'Hipertensão',
    'Diabetes',
    'Osteoporose',
    'Lombalgia',
    'Desvio de Coluna',
    'Fratura',
  ];

  return (
    <>
    <Navbar/>
    
      <Box p={4} maxWidth="800px" mx="auto">
        <form onSubmit={handleFormSubmit}>
          <FormControl mb={4}>
            <FormLabel>Tipo de Exercício</FormLabel>
            <Select
              placeholder="Selecione o tipo de exercício"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
            >
              <option value="forca">Força</option>
              <option value="cardio">Cardio</option>
              <option value="flexibilidade">Flexibilidade</option>
            </Select>
          </FormControl>

          <Table variant="simple" mb={10}>
            <TableCaption>Ficha de Exercícios</TableCaption>
            <Thead>
              <Tr>
                <Th>Exercício</Th>
                <Th>Séries</Th>
                <Th>Repetições</Th>
                <Th>Intensidade</Th>
                <Th>Tempo</Th>
              </Tr>
            </Thead>
            <Tbody>
              {exercicios
                .filter((exercicio) => exercicio.tipo === exerciseType)
                .map((exercicio) => (
                  <Tr key={exercicio.id}>
                    <Td>{exercicio.nome}</Td>
                    <Td>
                      <Input
                        type="number"
                        value={
                          exerciseData.find((data) => data.id === exercicio.id)
                            ?.series || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            exercicio.id,
                            "series",
                            e.target.value,
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={
                          exerciseData.find((data) => data.id === exercicio.id)
                            ?.repetitions || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            exercicio.id,
                            "repetitions",
                            e.target.value,
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="text"
                        value={
                          exerciseData.find((data) => data.id === exercicio.id)
                            ?.intensity || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            exercicio.id,
                            "intensity",
                            e.target.value,
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="text"
                        value={
                          exerciseData.find((data) => data.id === exercicio.id)
                            ?.frequency || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            exercicio.id,
                            "frequency",
                            e.target.value,
                          )
                        }
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>

          <Box>
        <Heading size="md" mb={2}>
          Condições de Saúde:
        </Heading>
        <CheckboxGroup
          colorScheme="blue"
          value={selectedOptions}
          onChange={handleCheckboxChange}
        >
          <VStack align="start">
            {opcoesSaude.map((opcao) => (
              <Checkbox key={opcao} value={opcao}>
                {opcao}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Box>

          <Button type="submit" colorScheme="blue" mt={4}>
            Criar Ficha de Paciente
          </Button>
        </form>
      </Box>
    </>
  );
};

export default ExerciseSheet;
