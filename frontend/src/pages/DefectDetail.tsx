import Layout from "@/layouts/Layout";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect } from "react";
import { Box, Heading, Text, Stack, Divider } from "@chakra-ui/react";

const DefectDetail = () => {
  const { defectItem, getDefect } = useDefectStore();

  useEffect(() => {
    getDefect();
  }, []);

  return (
    <Layout>
      <Box maxW="800px" mx="auto" p={6}>
        <Text fontWeight="bold">不具合情報</Text>
        <Heading size="lg" mb={4}>
          <Text>{defectItem.title}</Text>
        </Heading>
        <Divider />
        <Stack spacing={4}>
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
              <Text whiteSpace="pre-wrap">{defectItem.defect_detail}</Text>
            </Box>
          </Box>
          <Divider />
          <Box>
            <Text fontWeight="bold">対策内容</Text>
            <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text whiteSpace="pre-wrap">{defectItem.submission}</Text>
            </Box>
          </Box>
          <Divider />
          <Box>
            <Text fontWeight="bold">対策の入力期限</Text>
            <Text>{defectItem.submission_deadline}</Text>
          </Box>
          <Divider />
          <Box>
            <Text fontWeight="bold">作成者ID</Text>
            <Text>{defectItem.create_user}</Text>
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
};

export default DefectDetail;
