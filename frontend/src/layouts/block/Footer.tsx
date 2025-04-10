import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" minH="50px" bg="gray.100" py={3} textAlign="center">
      <Text fontSize="sm" color="gray.600">
        © 2025 工場管理くん制作委員会
      </Text>
    </Box>
  );
};

export default Footer;
