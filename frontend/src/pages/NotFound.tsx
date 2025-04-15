import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Layout from "@/layouts/Layout";
const NotFound = () => {
  return (
    <Layout>
      <Box textAlign="center" mt={20}>
        <Heading fontSize="6xl">404</Heading>
        <Text fontSize="xl" mt={4}>
          ページが見つかりません
        </Text>
        <Box mt={100} mb={100}>
          <Button as={Link} to="/" mt={6} colorScheme="teal">
            トップに戻る
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default NotFound;
