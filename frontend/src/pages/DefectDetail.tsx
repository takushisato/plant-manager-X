import { Box, Button, FormControl, FormLabel, VStack, Heading, Textarea } from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Text, Divider } from "@chakra-ui/react";

const DefectDetail = () => {
  const { defectItem, getDefect, updateSubmission } = useDefectStore();
  const { id } = useParams();
  const [editedDefect, setEditedDefect] = useState({
    title: "",
    occurred_at: "",
    order: "",
    defect_detail: "",
    submission: "",
    submission_deadline: "",
    create_user: "",
  });

  useEffect(() => {
    if (id) getDefect(Number(id));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDefect((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    updateSubmission(Number(id), editedDefect.submission);
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSave} maxW="800px" mx="auto" p={6}>
        <Text fontWeight="bold">不具合情報</Text>
        <Heading size="lg" mb={4}>
          <Text>{defectItem.title}</Text>
        </Heading>
        <form onSubmit={handleSave}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mt={4}>
                発生日
              </Text>
              <Text>{defectItem.occurred_at}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">関連注文ID</Text>
              <Text>{defectItem.order}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">不具合詳細</Text>
              <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                <Text whiteSpace="pre-wrap" minH="400px">
                  {defectItem.defect_detail}
                </Text>
              </Box>
            </Box>
            <FormControl>
              <FormLabel>対策</FormLabel>
              <Textarea
                name="submission"
                value={editedDefect.submission}
                onChange={handleChange}
                minHeight="400px"
                isRequired
              />
            </FormControl>
            <Box>
              <Text fontWeight="bold">対策の入力期限</Text>
              <Text>{defectItem.submission_deadline}</Text>
            </Box>
            <Button type="submit" colorScheme="teal" w="full" isDisabled={!editedDefect.submission}>
              対策を申請する
            </Button>
          </VStack>
        </form>
      </Box>
    </Layout>
  );
};

export default DefectDetail;
