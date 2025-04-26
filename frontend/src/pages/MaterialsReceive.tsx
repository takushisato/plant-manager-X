import Layout from "@/layouts/Layout";
import MaterialReceiveTable from "@/components/material/MaterialReceiveTable";
import { MaterialReceiveStock } from "@/types/material";
import { Column } from "@/types/common/generic-table";
import { Box } from "@chakra-ui/react";
import { useMaterialStore } from "@/hooks/useMaterialStore";
import { useEffect } from "react";

const MaterialsReceive = () => {
  const { materialReceiveStock, getMaterialReceiveStock } = useMaterialStore();

  useEffect(() => {
    getMaterialReceiveStock();
  }, []);

  const columns: Column<MaterialReceiveStock>[] = [
    { header: "資材名", accessor: "material_name" },
    { header: "在庫数", accessor: "stock_qty" },
    { header: "価格", accessor: "material_price" },
    { header: "発注在庫数", accessor: "order_suggestion_qty" },
    { header: "受け入れ", accessor: "receive_stock" },
  ];

  return (
    <Layout>
      <Box mt={4}>
        <MaterialReceiveTable columns={columns} data={materialReceiveStock} />
      </Box>
    </Layout>
  );
};

export default MaterialsReceive;
