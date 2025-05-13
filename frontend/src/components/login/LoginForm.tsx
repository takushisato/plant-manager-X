import { Box, Button, VStack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import InputWithTooltip from "@/components/common/InputWithTooltip";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { Loading } from "@/components/common/Loading";

const LoginForm = () => {
  const { showLoading, hideLoading, LoadingOverlay } = Loading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * ログイン
   * @param e
   */
  const handleLogin = async (e: React.FormEvent) => {
    try {
      showLoading();
      e.preventDefault();
      await login(email, password);
      toast({
        title: "ログインしました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "ログインに失敗しました",
        description: "メールアドレスかパスワードが間違っています",
        status: "error",
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <Box as="form" onSubmit={handleLogin} w="100%" maxW="400px" mx="auto">
      <Heading as="h1" size="lg" textAlign="center" mb={8} mt={8}>
        ログイン
      </Heading>
      <VStack spacing={4}>
        <InputWithTooltip
          label="メールアドレス"
          name="email"
          tooltip="登録済みのメールアドレスを入力してください"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isRequired={true}
        />

        <InputWithTooltip
          label="パスワード"
          name="password"
          tooltip="8文字以上のパスワードを入力してください"
          type="password"
          placeholder="登録済みのパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isRequired={true}
        />
        <Button type="submit" colorScheme="teal" w="full" isDisabled={!email || !password}>
          ログイン
        </Button>
      </VStack>
      <LoadingOverlay />
    </Box>
  );
};

export default LoginForm;
