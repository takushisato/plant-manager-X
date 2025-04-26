import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { MaterialList } from "@/types/material";
import { Column } from "@/types/common/generic-table";
import { Box } from "@chakra-ui/react";
import { useMaterialStore } from "@/hooks/useMaterialStore";
import { useEffect } from "react";

const Materials = () => {
  const columns: Column<MaterialList>[] = [
    { header: "資材名", accessor: "material_name" },
    { header: "在庫数", accessor: "stock_qty" },
    { header: "価格", accessor: "material_price" },
    { header: "発注在庫数", accessor: "order_suggestion_qty" },
  ];

  const { materialList, getMaterialList } = useMaterialStore();

  useEffect(() => {
    getMaterialList();
  }, []);

  return (
    <Layout>
      <Box mt={4}>
        <GenericTable columns={columns} data={materialList} />
      </Box>
    </Layout>
  );
};

export default Materials;
