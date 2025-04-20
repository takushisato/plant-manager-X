import Layout from "@/layouts/Layout";
import MaterialReceiveTable from "@/components/material/MaterialReceiveTable";
import { MaterialReceiveStock } from "@/types/material";
import { Column } from "@/domain/common/generic-table";
import { Box } from "@chakra-ui/react";
const MaterialsReceive = () => {
  // TODO モックからAPIに変更する
  const columns: Column<MaterialReceiveStock>[] = [
    { header: "資材名", accessor: "material_name" },
    { header: "在庫数", accessor: "stock_qty" },
    { header: "価格", accessor: "material_price" },
    { header: "発注在庫数", accessor: "order_suggestion_qty" },
    { header: "受け入れ", accessor: "receive_stock" },
  ];

  const data: MaterialReceiveStock[] = [
    {
      id: 1,
      material_name: "資材1",
      stock_qty: 100,
      material_price: 1000,
      order_suggestion_qty: 100,
      receive_stock: 1,
    },
    {
      id: 2,
      material_name: "資材2",
      stock_qty: 110,
      material_price: 1100,
      order_suggestion_qty: 100,
      receive_stock: 2,
    },
    {
      id: 3,
      material_name: "資材3",
      stock_qty: 120,
      material_price: 1200,
      order_suggestion_qty: 100,
      receive_stock: 3,
    },
    {
      id: 4,
      material_name: "資材4",
      stock_qty: 130,
      material_price: 1300,
      order_suggestion_qty: 100,
      receive_stock: 4,
    },
    {
      id: 5,
      material_name: "資材5",
      stock_qty: 140,
      material_price: 1400,
      order_suggestion_qty: 100,
      receive_stock: 5,
    },
  ];

  return (
    <Layout>
      <Box mt={4}>
        <MaterialReceiveTable columns={columns} data={data} />
      </Box>
    </Layout>
  );
};

export default MaterialsReceive;
