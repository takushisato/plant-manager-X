import { Box, Heading } from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import DefectEditForm from "@/components/defect/DefectEditForm";

const DefectDetail = () => {
  const { defectItem, getDefect } = useDefectStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) getDefect(Number(id));
  }, [id]);

  return (
    <Layout>
      <Box maxW="800px" mx="auto" p={6}>
        <Text fontWeight="bold">不具合情報</Text>
        <Heading size="lg" mb={4}>
          <Text>{defectItem.title}</Text>
        </Heading>
        <DefectEditForm defectItem={defectItem} />
      </Box>
    </Layout>
  );
};

export default DefectDetail;
