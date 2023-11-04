import React, { useEffect, useState } from "react";
import { Link as RLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Flex, HStack, Link } from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

const menuItems = [
  {
    path: "/products",
    name: "Browse Products",
  },
  {
    path: "/cart",
    name: "Cart",
  },
  {
    path: "/orders",
    name: "Orders",
  },
];

const Header = ({ scrolled }) => {
  const { clearStore, idToken } = useAuthStore();
  const location = useLocation();
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

  const handleLogout = () => {
    // console.log(token);
    clearStore();
    setIsLoggedIn(false);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `You have been logged out.`,
      confirmButtonColor: "#262626",
    }).then((res) => {
      window.location.replace("/login");
    });
  };

  return (
    <Flex
      as="header"
      color="primary.content"
      position="sticky"
      top="0"
      zIndex="100"
      transition="all 0.2s ease-in-out"
      h="100px"
      px={24}
      justifyContent={"center"}
      alignItems="center"
      // borderBottom="2px"
      bgColor="white"
      boxShadow="xl"
    >
      <Box className="hidden md:flex">
        <HStack spacing="10">
          {menuItems.map((item) => (
            <Link
              as={RLink}
              key={item.name}
              to={item.path}
              variant={location.pathname === item.path ? "active" : "inactive"}
            >
              {item.name}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link onClick={handleLogout}>Logout</Link>
          ) : (
            <Link as={RLink} to="/login">
              Login
            </Link>
          )}
        </HStack>
      </Box>
    </Flex>
  );
};

export default Header;
