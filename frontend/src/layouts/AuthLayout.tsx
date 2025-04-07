import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <Container maxW="container.md" px="5">
      <Box w="90%" mx="auto">
        <Outlet />
      </Box>
    </Container>
  );
}
