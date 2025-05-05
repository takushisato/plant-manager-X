import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Tooltip, Flex } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Box as="form" onSubmit={handleLogin} w="100%" maxW="400px" mx="auto">
      <Heading as="h1" size="lg" textAlign="center" mb={8} mt={8}>
        ログイン
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <Flex align="center" gap={1}>
            <FormLabel mb={0} htmlFor="email">
              メールアドレス
            </FormLabel>
            <Tooltip label="登録済みのメールアドレスを入力してください" hasArrow>
              <Box as="span" display="inline-flex" alignItems="center">
                <QuestionIcon boxSize={4} color="gray.500" cursor="help" />
              </Box>
            </Tooltip>
          </Flex>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <Flex align="center" gap={1}>
            <FormLabel mb={0} htmlFor="password">
              パスワード
            </FormLabel>
            <Tooltip label="8文字以上のパスワードを入力してください" hasArrow>
              <Box as="span" display="inline-flex" alignItems="center">
                <QuestionIcon boxSize={4} color="gray.500" cursor="help" />
              </Box>
            </Tooltip>
          </Flex>
          <Input
            type="password"
            placeholder="登録済みのパスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" w="full">
          ログイン
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginForm;
