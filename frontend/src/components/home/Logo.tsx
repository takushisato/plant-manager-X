import { Text, HStack, Icon } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";

const Logo = () => {
  return (
    <HStack spacing={1} align="baseline">
      <Text
        fontSize="2xl"
        fontWeight="extrabold"
        color="teal.500"
        data-testid="home-logo-title"
      >
        工場管理くん
      </Text>
      <Icon as={FaCog} color="teal.400" boxSize={4} ml={1} mr={1} />
      <Text fontSize="md" fontWeight="medium" color="gray.700">
        プロトタイプ
      </Text>
    </HStack>
  );
};

export default Logo;
