import { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSignin = async () => {
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log(email, password);
    try {
      console.log("try");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        mx="auto"
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="blue.200"
        shadow="md"
      >
        <Box p={4} boxShadow="md" textAlign="center" backgroundColor="white">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Physicare
          </Text>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" ref={emailRef} />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Senha</FormLabel>
            <Input type="password" ref={passwordRef} />
          </FormControl>
          <Button
            isLoading={loading}
            colorScheme="blue"
            mb={4}
            onClick={handleSignin}
          >
            Entrar
          </Button>
          <Text>
            Não tem uma conta?{" "}
            <Link to={"/signup"}>
              <Text as="span" color="blue.500">
                Cadastre-se agora!
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Signin;
