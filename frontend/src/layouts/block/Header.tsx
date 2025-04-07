import { Box, Flex, Heading, IconButton, Spacer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Box as="header" bg="teal.500" px={4} py={3} color="white">
      <Flex align="center">
        <Heading size="md">MySite</Heading>
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
            color="white"
            borderColor="white"
            _hover={{ bg: 'teal.600' }}
          />
          <MenuList>
            <MenuItem as={Link} to="/">Home</MenuItem>
            <MenuItem as={Link} to="/about">About</MenuItem>
            <MenuItem as={Link} to="/contact">Contact</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Header;
