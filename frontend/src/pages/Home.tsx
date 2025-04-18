import { Flex } from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import Logo from "@/components/home/Logo";

const Home = () => {
  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        height="100%"
        minHeight="calc(100vh - 100px)"
      >
        <Logo />
      </Flex>
    </Layout>
  );
};

export default Home;
