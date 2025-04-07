import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function WhitePageLayout() {
  return (
    <Container maxW="container.md" p={0}>
      <Outlet />
    </Container>
  );
}
