import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NumberField from "../components/NumberField";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CartPage = () => {
  const { email, token } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const [checkedItems, setCheckedItems] = useState([]);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;
  const [cartInfo, setCartInfo] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [toCheckout, setToCheckout] = useState([]);
  const navigate = useNavigate();
  // console.log(allChecked, isIndeterminate);

  useEffect(() => {
    fetchCartItems(true);
  }, []);

  useEffect(() => {
    // console.log("changes detected", cartInfo);
    if (cartInfo !== undefined) {
      setTotalPrice(fetchTotalPrice(cartInfo["items"]));
    }
  }, [cartInfo]);

  const fetchCartItems = (initCheckedItems) => {
    axios
      .get(`${import.meta.env.VITE_CART_ENDPOINT}/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartInfo(res.data.data);
        // if (initCheckedItems) {
        //   setCheckedItems(new Array(res.data.data["items"].length).fill(false));
        // }
      });
  };

  const fetchTotalPrice = (items) => {
    let totalPrice = 0;

    for (let i = 0; i < items.length; i++) {
      totalPrice += items[i].price * items[i].quantity;
    }
    return totalPrice;
  };

  const removeItem = (idx, productId) => {
    let temp = { ...cartInfo };
    let removed = temp["items"].splice(idx, 1);
    setCartInfo(temp);

    axios
      .put(
        `${import.meta.env.VITE_CART_ENDPOINT}/remove/${email}/${productId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Product has been removed from cart.`,
          confirmButtonColor: "#262626",
        });
      })
      .catch((e) => console.log(e));
  };

  const handleCheckout = () => {
    // let checkedIndex = [];
    // for (let i = 0; i < checkedItems.length; i++) {
    //   if (checkedItems[i] === true) {
    //     checkedIndex.push(i);
    //   }
    // }

    // if (checkedIndex.length === 0) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Please select the items you wish to checkout.",
    //     confirmButtonColor: "#262626",
    //   });
    //   return;
    // }

    setCart(cartInfo.items);
    navigate("/payment");
  };

  const handleUpdateQuantity = (newValue, idx) => {
    let temp = { ...cartInfo };
    let currentQuantity = Number(temp["items"][idx].quantity);
    let newQuantity = Number(newValue);

    if (currentQuantity === newQuantity) {
      return;
    }
    let quantityToAdd = newQuantity - currentQuantity;

    let item = temp["items"][idx];
    let data = {
      product_id: item["product_id"],
      product_name: item["product_name"],
      price: item["price"],
      seller_email: item["seller_email"],
      image_url: item["image_url"],
      quantity: quantityToAdd,
    };

    axios
      .post(`${import.meta.env.VITE_ADD_TO_CART_ENDPOINT}/${email}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        temp["items"][idx]["quantity"] = newQuantity;
        temp["total_price"] = fetchTotalPrice(temp["items"]);
        fetchCartItems();
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(e),
          confirmButtonColor: "#262626",
        });
      });
  };

  return (
    <Box w="100%">
      <Flex minW="6xl" m="auto" mt="24" p="25" justifyContent="center">
        <Box>
          <Heading>Shopping Cart</Heading>
          <Box width="100%" mt="15px">
            <VStack alignSelf={"start"} spacing="5" mt="25px">
              {cartInfo?.items.map((item, idx) => {
                return (
                  <HStack
                    bgColor="white"
                    borderRadius="24px"
                    overflow="hidden"
                    px="12"
                    spacing="16"
                  >
                    <Box
                      p="5"
                      border="1px"
                      borderColor="#d7d7d7"
                      borderRadius="12px"
                    >
                      <Image src={item.image_url} h="50px" w="50px"></Image>
                    </Box>
                    <Box>
                      <Text fontSize="2xl" fontWeight="bold">
                        {item.product_name}
                      </Text>
                      <Flex>
                        Sold by&nbsp;
                        <Text fontWeight="semibold" color="blue.500">
                          {item.seller_email?.split(".")[0]}
                        </Text>
                      </Flex>
                    </Box>
                    <NumberField
                      maxWidth={"200px"}
                      defaultValue={item.quantity}
                      onChange={(val) => {
                        handleUpdateQuantity(val, idx);
                      }}
                    />
                    <Box textAlign={"center"}>
                      <Text>Subtotal</Text>
                      <Text fontWeight="semibold">{`$${
                        item.price * item.quantity
                      }`}</Text>
                    </Box>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        removeItem(idx, item.product_id);
                      }}
                    >
                      Remove
                    </Button>
                  </HStack>
                );
              })}
            </VStack>
          </Box>

          <Flex direction="column" mt="35px">
            <Heading>Order Summary</Heading>
            <Box>
              <Text>{`TOTAL (${cartInfo?.items.length} items) `}</Text>
              <Text fontWeight="bold">{`$${totalPrice}`}</Text>
            </Box>
            <Button colorScheme="teal" size="lg" onClick={handleCheckout}>
              Review & Pay
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default CartPage;
