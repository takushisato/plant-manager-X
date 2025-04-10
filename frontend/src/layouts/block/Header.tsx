import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useUserStore } from "@/hooks/useUser";
import { useEffect } from "react";

const Header = () => {
  const { user, getUser } = useUserStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Box as="header" bg="teal.500" px={4} py={3} color="white">
      <Flex align="center">
        <Heading size="md" as={Link} to="/">
          工場管理くん
        </Heading>
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
            color="white"
            borderColor="white"
            _hover={{ bg: "teal.600" }}
          />
          <MenuList color="green.700">
            <Box textAlign="center" px={3} py={2} fontSize="sm">
              {user?.name ? (
                <Text color="green.400">ログイン中: {user?.name}さん</Text>
              ) : (
                <Text color="red.500">ログインしていません</Text>
              )}
            </Box>
            <MenuItem as={Link} to="/login" display="block" textAlign="center">
              ログイン
            </MenuItem>
            <MenuItem as={Link} to="/" display="block" textAlign="center">
              資材管理
            </MenuItem>
            <MenuItem as={Link} to="/" display="block" textAlign="center">
              受注管理
            </MenuItem>
            <MenuItem as={Link} to="/" display="block" textAlign="center">
              生産計画
            </MenuItem>
            <MenuItem as={Link} to="/" display="block" textAlign="center">
              勤怠管理
            </MenuItem>
            <MenuItem as={Link} to="/" display="block" textAlign="center">
              不具合情報
            </MenuItem>
            <MenuItem as={Link} to="/" display="block" textAlign="center">
              社内メール
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Header;
