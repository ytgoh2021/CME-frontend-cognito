import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Flex,
  Heading,
  Image,
  Select,
  Text,
  Tag,
  TagLabel,
  HStack,
  VStack,
  StackDivider,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";

const OrderPage = () => {
  const { email, token } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [modalProductName, setModalProductName] = useState("");
  const [modalProductId, setModalProductId] = useState("");
  const [modalOrderId, setModalOrderId] = useState("");
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();

  const fetchOrderList = () => {
    axios
      .get(`${import.meta.env.VITE_ORDER_ENDPOINT}/get/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrder(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your session has ended. Please login to continue.",
          confirmButtonColor: "#262626",
        }).then((res) => {
          navigate("/login");
        });
      });
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  // Submit Review
  const handleReview = () => {
    // console.log(modalProductId, modalOrderId, email, review, rating);

    if (review == "" || rating == "") {
      handleClose();
      Swal.fire({
        icon: "error",
        title: "Oopss!",
        text: "Please fill in all the fields!",
        confirmButtonColor: "#262626",
      });
      return;
    }

    let payload = {
      product_id: modalProductId,
      order_id: modalOrderId,
      user_id: email,
      review_description: review,
      review_stars: rating,
    };
    axios
      .post(`${import.meta.env.VITE_MAKEREVIEW_ENDPOINT}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        handleClose();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Your review for ${modalProductName} has been submitted!`,
          confirmButtonColor: "#262626",
        });
      })
      .catch((err) => {
        console.log(err);
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Oopss!",
          text: `You have already reviewed ${modalProductName}!`,
          confirmButtonColor: "#262626",
        });
        return;
      });
  };

  // For Forms
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  // Modal
  const handleReviewClick = (productName, productId, orderId) => {
    onOpen();
    setModalProductName(productName);
    setModalProductId(productId);
    setModalOrderId(orderId);
  };

  const handleClose = () => {
    onClose();
    setRating("");
    setReview("");
    setModalProductName("");
    setModalProductId("");
    setModalOrderId("");
  };

  return (
    <>
      <Flex w="100%">
        <Box w="8xl" m="auto" mt="24">
          <Heading>
            Orders
            <Tag
              variant="subtle"
              colorScheme="blue"
              verticalAlign={"middle"}
              ml={"10px"}
            >
              <TagLabel>{order.length}</TagLabel>
            </Tag>
          </Heading>
          {order.length != 0 ? (
            order.map((order, idx) => (
              <Box
                mt="30px"
                boxShadow="xl"
                p="6"
                rounded="md"
                bg="white"
                key={idx}
              >
                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={4}
                  align="stretch"
                >
                  <Box h="20px">
                    <Text fontWeight="bold">
                      Order Id - {order.order_id} &nbsp; &nbsp; (Date:&nbsp;
                      {order.time})
                    </Text>
                  </Box>
                  {order.items.map((item, idx) => (
                    <Box h="110px" mx="10px" key={idx}>
                      <Flex alignItems="center">
                        <HStack spacing="24px">
                          <Box
                            h="100px"
                            w="100px"
                            as={Link}
                            to={`/product/${item.product_id}`}
                          >
                            <Image
                              src={item.image_url}
                              objectFit="contain"
                              h="100px"
                              w="100%"
                              alignSelf="flex-start"
                              borderRadius="20px"
                            />
                          </Box>
                          <Box
                            as={Link}
                            to={`/product/${item.product_id}`}
                            _hover={{ textDecoration: "none" }}
                          >
                            <Text>{item.product_name}</Text>
                            <Text>Quantity Purchased: {item.quantity}</Text>
                            <Text>Price: ${item.price}</Text>
                            <Text>Order Status: {order.status}</Text>
                            <Text>Seller: {item.seller_email}</Text>
                          </Box>
                        </HStack>
                        <Spacer />
                        <Box>
                          <Button
                            colorScheme="blue"
                            onClick={() =>
                              handleReviewClick(
                                item.product_name,
                                item.product_id,
                                order.order_id
                              )
                            }
                          >
                            Review
                          </Button>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))
          ) : (
            <Box my="20px" pl="5px">
              <Text>No orders yet!</Text>
            </Box>
          )}
        </Box>
      </Flex>
      <Modal
        initialFocusRef={initialRef}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Review - {modalProductName} (Order ID: {modalOrderId})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Rating</FormLabel>
              <Select placeholder="Select rating" onChange={handleRatingChange}>
                <option value="5">5 stars - Amazing</option>
                <option value="4">4 stars - Good</option>
                <option value="3">3 stars - Fair</option>
                <option value="2">2 stars - Poor</option>
                <option value="1">1 stars - Terrible</option>
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Review</FormLabel>
              <Textarea
                ref={initialRef}
                px="15px"
                placeholder="Share your thoughts on the product"
                onChange={handleReviewChange}
                minH="200px"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleReview}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrderPage;
