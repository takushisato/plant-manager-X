import Layout from "@/layouts/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useDefectStore } from "@/hooks/useDefectStore";
import { DefectCreateItem } from "@/types/defect";
import DefectCreateForm from "@/components/defect/DefectCreateForm";

const DefectCreate = () => {
  const { createDefect } = useDefectStore();
  const { user } = useAuthStore();
  const [form, setForm] = useState<DefectCreateItem>({
    occurred_at: "",
    title: "",
    defect_detail: "",
    submission: "当事者が後日入力",
    submission_deadline: "",
    create_user: user?.id ?? NaN,
    order: 0,
  });

  useEffect(() => {
    if (user?.id) {
      setForm((prev) => ({ ...prev, create_user: user.id }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDefect(form);
  };

  return (
    <Layout>
      <Box maxW="800px" mx="auto" p={6}>
        <Heading size="md" mb={4}>
          不具合の新規投稿
        </Heading>
        <DefectCreateForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
      </Box>
    </Layout>
  );
};

export default DefectCreate;
