import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
} from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

const DefectCreate = () => {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    occurred_at: "",
    title: "",
    defect_detail: "",
    submission: "当事者が後日入力",
    submission_deadline: "",
    create_user: user?.id ?? "",
    order: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Zustand や API 経由で登録処理を実装
    alert("不具合を登録しました: " + JSON.stringify(form));
  };

  return (
    <Layout>
      <Box maxW="800px" mx="auto" p={6}>
        <Heading size="md" mb={4}>
          不具合の新規投稿
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>発生日</FormLabel>
              <Input
                type="date"
                name="occurred_at"
                value={form.occurred_at}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>タイトル</FormLabel>
              <Input name="title" value={form.title} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>不具合詳細</FormLabel>
              <Textarea
                name="defect_detail"
                value={form.defect_detail}
                onChange={handleChange}
                minHeight="600px"
              />
            </FormControl>
            <FormControl>
              <FormLabel>対策の入力期限</FormLabel>
              <Input
                type="date"
                name="submission_deadline"
                value={form.submission_deadline}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>作成者ID</FormLabel>
              <Input
                type="number"
                name="create_user"
                value={form.create_user}
                onChange={handleChange}
                isDisabled
              />
            </FormControl>
            <FormControl>
              <FormLabel>関連注文ID</FormLabel>
              <Input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal">
              登録
            </Button>
          </VStack>
        </form>
      </Box>
    </Layout>
  );
};

export default DefectCreate;
