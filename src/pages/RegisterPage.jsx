import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "../components/Login/PasswordField";
import { useEffect, useReducer } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate();
  const reducer = (state, action) => {
    switch (action.type) {
      case "changed_email":
        return {
          email: action.nextEmail,
          password: state.password,
        };
      case "changed_password":
        return {
          email: state.email,
          password: action.nextPassword,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
    address: "",
  });

  const handleRegistration = () => {
    // perform check on empty email/password
    if (state.email === "" || state.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email and/or password cannot be empty",
        confirmButtonColor: "#262626",
      });
      return;
    }

    // register account
    axios
      .post(`${import.meta.env.VITE_AUTH_ENDPOINT}/register`, state)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Account has been registered. Please proceed to login.`,
          confirmButtonColor: "#262626",
        }).then((result) => {
          navigate("/login");
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(err),
          confirmButtonColor: "#262626",
        });
        return;
      });
  };

  return (
    <Box h="calc(100vh - 100px)" p="24">
      <Container
        maxW="xl"
        py={{
          base: "12",
          md: "16",
        }}
        px={{
          base: "0",
          sm: "8",
          md: "16",
        }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}>
              <Heading textAlign={"left"} size={"2xl"}>
                REGISTER
              </Heading>
            </Stack>
          </Stack>
          <Box>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => {
                      dispatch({
                        type: "changed_email",
                        nextEmail: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <PasswordField
                  onChange={(e) => {
                    dispatch({
                      type: "changed_password",
                      nextPassword: e.target.value,
                    });
                  }}
                />
              </Stack>
              <Stack spacing="6">
                <Button colorScheme="teal" onClick={handleRegistration}>
                  Register
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default RegisterPage;
