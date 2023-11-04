import { Box } from "@chakra-ui/react";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import jwt_decode from "jwt-decode";

const Layout = ({ children, className }) => {
  const { idToken } = useAuthStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (idToken !== null) {
      let decoded = jwt_decode(idToken);
      let token_exp = new Date(decoded.exp * 1000);
      if (token_exp > Date.now()) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  return (
    <Box>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Box as="main" minH={"calc(100vh - 150px)"}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
