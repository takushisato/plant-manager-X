import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import type { DefectTableList } from "@/types/defect";
import { Column } from "@/types/common/generic-table";
import { Box } from "@chakra-ui/react";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect } from "react";
const DefectList = () => {
  const { defectList, getDefects } = useDefectStore();

  useEffect(() => {
    getDefects();
  }, []);

  const columns: Column<DefectTableList>[] = [
    { header: "作成者", accessor: "create_user_name" },
    { header: "注文番号", accessor: "order_number" },
    { header: "発生日時", accessor: "occurred_at" },
    { header: "タイトル", accessor: "title" },
    { header: "詳細", accessor: "defect_detail_button" },
  ];

  return (
    <Layout>
      <Box mt={4}>
        <GenericTable columns={columns} data={defectList} />
      </Box>
    </Layout>
  );
};


export default DefectList;
