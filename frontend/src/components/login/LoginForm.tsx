import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Box as="form" onSubmit={handleLogin} w="100%" maxW="400px" mx="auto">
      <Heading as="h1" size="lg" textAlign="center" mb={8} mt={8}>
        ログイン
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>メールアドレス</FormLabel>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>パスワード</FormLabel>
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
