import Layout from "@/layouts/Layout";
import { Box } from "@chakra-ui/react";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect } from "react";
const DefectGraph = () => {
  const { defectList, getDefects } = useDefectStore();

  useEffect(() => {
    getDefects();
  }, []);

  return (
    <Layout>
      <Box mt={4}>
        <p>グラフ</p>
      </Box>
    </Layout>
  );
};

export default DefectGraph;
