import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/authStore";
import jwtDecode from "jwt-decode";

const LoginPage = () => {
  const loginUrl = import.meta.env.VITE_LOGIN_ENDPOINT;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const clientId = import.meta.env.VITE_CLIENT_ID;

  const navigate = useNavigate();
  const { accessToken: token, setToken } = useAuthStore();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");

  const handleAuth = async (code) => {
    const payload = {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      client_id: clientId,
    };

    try {
      const res = await axios.post(
        "https://cmee.auth.us-east-1.amazoncognito.com/oauth2/token",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // console.log(res);

      const idToken = res.data.id_token;
      const decodedToken = jwtDecode(idToken);

      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      setToken({
        id_token: idToken,
        access_token: accessToken,
        refresh_token: refreshToken,
        email: decodedToken.email,
        cognito_username: decodedToken["cognito:username"],
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `You have been logged in.`,
        confirmButtonColor: "#262626",
      });

      setTimeout(() => {
        window.location.href = "/products";
      }, 2000);
    } catch (e) {
      console.log("Error: ", e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#262626",
      }).then((result) => {
        window.location.href = "/login";
      });
    }
  };

  useEffect(() => {
    if (!code || token) return;
    handleAuth(code);
  }, [code, token]);

  useEffect(() => {
    if (token !== null) {
      navigate("/");
    }
  }, []);

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
        }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}
            >
              <Heading textAlign={"left"} size={"2xl"}>
                LOGIN
              </Heading>
              <HStack spacing="1">
                <Text color="muted">Don't have an account?</Text>
                <Button
                  as={RLink}
                  to={loginUrl}
                  variant="link"
                  colorScheme="blue"
                >
                  Sign up with Cognito
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Box>
            <Stack spacing="6">
              <Button as={RLink} colorScheme="teal" to={loginUrl}>
                Sign in with Cognito
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
