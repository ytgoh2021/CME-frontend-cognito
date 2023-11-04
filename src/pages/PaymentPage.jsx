import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PaymentPage = () => {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
    year: "",
    month: "",
  });
  const { cart } = useCartStore();
  const { email, token } = useAuthStore();
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("changed", state);
  // }, [state]);

  // useEffect(() => {
  //   console.log("ayo", cart);
  // }, []);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    if (name === "expiry" && value.length === 4) {
      // console.log(typeof value);
      let tempMonth = Number(value.substring(0, 2));
      let tempYear = Number("20" + value.substring(2, 4));
      let temp = { ...state };
      temp.month = tempMonth;
      temp.year = tempYear;
      temp.expiry = value;
      setState(temp);
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handlePayment = () => {
    // console.log("hehe", state, cart);
    let data = {
      product_ids: cart.map((item) => item.product_id),
      card: {
        number: state.number,
        exp_month: state.month,
        exp_year: state.year,
        cvc: state.cvc,
      },
    };

    axios
      .post(`${import.meta.env.VITE_PLACE_AN_ORDER_ENDPOINT}/${email}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Order placed!`,
          confirmButtonText: "View Order",
          showCancelButton: true,
          cancelButtonText: "Back",
          confirmButtonColor: "#262626",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/orders");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(err.response.data.message),
          confirmButtonColor: "#262626",
        });
      });
  };

  return (
    <Box w="100%">
      <VStack
        w="6xl"
        m="auto"
        mt="24"
        p="25"
        direction="column"
        alignSelf={"start"}>
        <Box>
          <Heading>Review</Heading>
          {cart &&
            cart.map((item, idx) => {
              return (
                <Flex key={idx} mt="5">
                  <Box
                    p="15px"
                    border="1px"
                    borderColor="#d7d7d7"
                    borderRadius="12px"
                    mr="5">
                    <Image
                      src={item.image_url}
                      height="50px"
                      width="50px"
                      objectFit="contain"></Image>
                  </Box>
                  <HStack spacing="16" w="100%">
                    <Box>
                      <Text fontWeight="bold" fontSize="2xl">
                        {item.product_name}
                      </Text>
                      <Flex>
                        Sold by&nbsp;
                        <Text fontWeight="semibold" color="blue.500">
                          {item.seller_email?.split(".")[0]}
                        </Text>
                      </Flex>
                    </Box>
                    <Box textAlign={"center"}>
                      <Text fontWeight="bold">Price</Text>
                      <Text>${item.price}</Text>
                    </Box>
                    <Box textAlign="center">
                      <Text fontWeight="bold">Quantity</Text>
                      <Text>{item.quantity}</Text>
                    </Box>
                    <Box textAlign={"center"}>
                      <Text fontWeight="bold">Subtotal</Text>
                      <Text>${item.quantity * item.price}</Text>
                    </Box>
                  </HStack>
                </Flex>
              );
            })}
          <Box width="100%" mt="15px"></Box>
        </Box>
        <Box>
          <Heading>Payment</Heading>
          <Box width="100%" mt="15px">
            <SimpleGrid columns={2} spacing={10}>
              <Cards
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.name}
                focused={state.focus}
              />
              <VStack spacing="15">
                <Input
                  maxLength={16}
                  type="tel"
                  name="number"
                  className="form-control"
                  placeholder="Card Number"
                  pattern="[\d| ]{16,22}"
                  required={true}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <Input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <Input
                  type="tel"
                  name="expiry"
                  maxLength={4}
                  placeholder="Valid Thru"
                  pattern="\d\d/\d\d"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <Input
                  type="tel"
                  name="cvc"
                  maxLength={3}
                  placeholder="CVC"
                  pattern="\d{3,4}"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <Button colorScheme="teal" w="100%" onClick={handlePayment}>
                  Pay
                </Button>
              </VStack>
            </SimpleGrid>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
export default PaymentPage;
