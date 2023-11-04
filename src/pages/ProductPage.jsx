import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  Text,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import { Link as RLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import NumberField from "../components/NumberField";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";

const ProductPage = () => {
  const { id } = useParams();
  const { email, token } = useAuthStore();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const fetchProductDetails = () => {
    axios
      .get(`${import.meta.env.VITE_PRODUCT_ENDPOINT}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProduct(res.data.data);
      });
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const addToCart = () => {
    // console.log(product);
    // console.log(quantity);
    let data = {
      product_id: product["product_id"],
      product_name: product["product_name"],
      price: product["price"],
      seller_email: product["seller_email"],
      image_url: product["image_url"],
      quantity: Number(quantity),
    };

    axios
      .post(`${import.meta.env.VITE_ADD_TO_CART_ENDPOINT}/${email}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        fetchProductDetails();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Added cart!`,
          confirmButtonText: "View Cart",
          showCancelButton: true,
          cancelButtonText: "Back",
          confirmButtonColor: "#262626",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/cart");
          }
        });
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

  // Review
  const [review, setReview] = useState([]);

  const fetchReviewDetails = () => {
    axios
      .get(`${import.meta.env.VITE_REVIEW_ENDPOINT}/get/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.data);
        setReview(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchReviewDetails();
  }, []);

  return (
    <Flex w="100%">
      <Box w="6xl" m="auto" mt="24">
        <HStack mt={2} p={4} spacing={24}>
          <Flex
            w="500px"
            h="500px"
            p="35px"
            borderRadius="15px"
            border="1px"
            borderColor="#efefef"
            alignItems="center"
          >
            <Image
              src={product.image_url}
              objectFit="contain"
              h="300px"
              w="100%"
            ></Image>
          </Flex>
          <Box>
            <VStack alignItems="start">
              <Box>
                <Heading>{product.product_name}</Heading>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                >{`$${product.price}`}</Text>
              </Box>
              <Box>
                Sold by{" "}
                <Link variant="link" color="#2081e2" fontWeight="semibold">
                  {product.seller_email?.split(".")[0]}
                </Link>
              </Box>
              <Box>
                {product.stock - quantity < 0 ? (
                  <Text color="red" fontWeight="bold">
                    Product is out of stock
                  </Text>
                ) : (
                  <>
                    <Text fontWeight="semibold" color="#04111d">
                      Quantity
                    </Text>
                    <NumberField
                      onChange={(val) => {
                        setQuantity(val);
                      }}
                      maxWidth="100%"
                      max={product.stock}
                    />
                    <Text>{product.stock - quantity} stock available</Text>
                  </>
                )}
              </Box>
            </VStack>
            {product.stock - quantity < 0 ? (
              <Button size="lg" w="100%" mt="5" colorScheme="teal">
                Notify me when it's back in stock!
              </Button>
            ) : (
              <Button
                colorScheme="teal"
                size="lg"
                w="100%"
                mt="5"
                onClick={addToCart}
                disabled={product.stock - quantity < 0 ? true : false}
              >
                Add to cart
              </Button>
            )}
          </Box>
        </HStack>
        <Box mt={2} p={4} boxShadow="xl" rounded="md" bg="white">
          <Text fontWeight="bold" fontSize="3xl">
            Reviews
          </Text>
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
            mt={3}
          >
            {review.length != 0 ? (
              review.map((item, idx) => (
                <Box h="110px" key={idx} pl="5px">
                  <Text fontSize="xs" fontWeight="bold">
                    {item.user_id.slice(0, item.user_id.indexOf("@") / 2) +
                      "****" +
                      item.user_id.slice(item.user_id.indexOf("@") / 2)}
                  </Text>
                  <Text fontSize="xs">
                    Rated - {item.review_stars} / 5 Stars
                  </Text>
                  <Text fontSize="xs">{item.review_date}</Text>
                  <Text fontSize="sm" mt="10px">
                    {item.review_description}
                  </Text>
                </Box>
              ))
            ) : (
              <Text pl="3px" pb="10px">
                No reviews yet
              </Text>
            )}
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default ProductPage;
