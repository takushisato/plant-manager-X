import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import theme from '@/theme';

export default function HomeLayout() {
  return (
    <Box
      h="100dvh"
      bg={theme.colors.background.main}
      pb={{ base: '50px', md: 0 }}
    >
      <Container maxW="container.md" p={0}>
        <Outlet />
      </Container>
    </Box>
  );
}
