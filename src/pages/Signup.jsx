import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Avatar,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../lib/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [avatarImage, setAvatarImage] = useState("");
  const nameRef = useRef();
  const birthdateRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const genderRef = useRef();
  const specialityRef = useRef();
  const avatarInputRef = useRef();

  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatarImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    console.log("signup");
    const name = nameRef.current.value;
    const avatar = avatarInputRef.current.files[0];
    const birthdate = new Date(birthdateRef.current.value.split("-"));
    const gender = genderRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    let speciality = "";
    if (isProfessional) {
      speciality = specialityRef.current.value;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      console.log("1º try block");
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `profilePhotos/${name + date}`);

      await uploadBytesResumable(storageRef, avatar).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            console.log("2º try block");

            await updateProfile(res.user, {
              displayName: name,
              photoURL: downloadURL,
            });
            if (isProfessional) {
              await setDoc(doc(firestore, "users", res.user.uid), {
                uid: res.user.uid,
                avatar: downloadURL,
                birthdate,
                gender,
                email,
                name,
                speciality,
                role: "professional",
              });
              await setDoc(doc(firestore, "professionals", res.user.uid), {
                uid: res.user.uid,
                avatar: downloadURL,
                birthdate,
                gender,
                email,
                name,
                speciality,
              });
            } else {
              await setDoc(doc(firestore, "users", res.user.uid), {
                uid: res.user.uid,
                avatar: downloadURL,
                birthdate,
                gender,
                email,
                name,
                role: "pacient",
              });
              await setDoc(doc(firestore, "pacients", res.user.uid), {
                uid: res.user.uid,
                avatar: downloadURL,
                birthdate,
                gender,
                email,
                name,
              });
            }
            await setDoc(doc(firestore, "userChats", res.user.uid), {});
            navigate("/");
          } catch (error) {
            console.log(error);
          }
        });
      });
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
        p={8}
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
          <Avatar
            size="xl"
            src={avatarImage}
            mb={4}
            onClick={handleAvatarClick}
            cursor="pointer"
          />
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
            ref={avatarInputRef}
          />
          <FormControl id="name" mb={4}>
            <FormLabel>Nome</FormLabel>
            <Input type="text" ref={nameRef} />
          </FormControl>
          <FormControl id="birthdate" mb={4}>
            <FormLabel>Data de nascimento</FormLabel>
            <Input type="date" ref={birthdateRef} />
          </FormControl>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="text" ref={emailRef} />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Senha</FormLabel>
            <Input type="password" ref={passwordRef} />
          </FormControl>
          <FormControl id="confirmPassword" mb={4}>
            <FormLabel>Confirmar senha</FormLabel>
            <Input type="password" ref={confirmPasswordRef} />
          </FormControl>
          <FormControl id="gender" mb={4}>
            <FormLabel>Gênero</FormLabel>
            <Select placeholder=" Escolha um gênero" ref={genderRef}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outros">Outros</option>
            </Select>
          </FormControl>
          <FormControl id="isProfessional" mb={4}>
            <Checkbox
              onChange={(e) => setIsProfessional(e.target.checked)}
              isChecked={isProfessional}
            >
              É um profissional?
            </Checkbox>
          </FormControl>
          {isProfessional && (
            <FormControl maxW={"100%"} id="speciality" mb={4}>
              <FormLabel>Especialidade</FormLabel>
              <Input type="text" ref={specialityRef} />
            </FormControl>
          )}
          <Button
            isLoading={loading}
            colorScheme="blue"
            mb={4}
            onClick={handleSignup}
          >
            Cadastrar-se
          </Button>
          <Text>
            Já possui uma conta?{" "}
            <Link to={"/signin"}>
              <Text as="span" color="blue.500">
                Entre agora!
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Signup;
