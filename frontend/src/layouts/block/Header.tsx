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
import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const Header = () => {
  const { user, restoreSession, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * ログアウトの実行
   */
  const handleLogout = async () => {
    await logout();
    restoreSession();
    setIsOpen(false);
  };

  /**
   * ダイアログを閉じる
   */
  const handleDialogClose = () => {
    setIsOpen(false);
  };

  /**
   * ダイアログを開く
   */
  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

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
            <Box textAlign="center" px={3} py={2} fontSize="sm" bg="yellow.100">
              {user?.name ? (
                <Text color="green.400">ログイン中: {user?.name}さん</Text>
              ) : (
                <Text color="red.500">ログインしていません</Text>
              )}
            </Box>
            <MenuItem
              as={Link}
              to={user?.name ? "#" : "/login"}
              onClick={user?.name ? handleDialogOpen : undefined}
              textAlign="center"
              justifyContent="center"
            >
              {user?.name ? "ログアウト" : "ログイン"}
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
      <ConfirmDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        onConfirm={handleLogout}
        title="ログアウト"
        message="ログアウトしますか？"
        onCloseButtonText="キャンセル"
        onConfirmButtonText="ログアウト"
      />
    </Box>
  );
};

export default Header;
