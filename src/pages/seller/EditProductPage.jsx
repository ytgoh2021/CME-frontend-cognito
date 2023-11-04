import { Box, Flex, Heading } from "@chakra-ui/react";

const EditProductPage = () => {
  return (
    <Box w="100%">
      <Flex maxW="6xl" m="auto" mt="24" p="25">
        <Box>
          <Heading>Edit product</Heading>
          <Box width="100%" mt="15px"></Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default EditProductPage;
