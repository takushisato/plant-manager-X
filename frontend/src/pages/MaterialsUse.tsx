import Layout from "@/layouts/Layout";
import MaterialUseStockTable from "@/components/material/MaterialUseStockTable";
import { MaterialUseStock } from "@/domain/material/list";
import { Column } from "@/domain/common/generic-table";
import { Box } from "@chakra-ui/react";
const MaterialsUse = () => {
  const columns: Column<MaterialUseStock>[] = [
    { header: "資材名", accessor: "material_name" },
    { header: "在庫数", accessor: "stock_qty" },
    { header: "価格", accessor: "material_price" },
    { header: "発注在庫数", accessor: "order_suggestion_qty" },
    { header: "払い出し", accessor: "use_stock" },
  ];

  const data: MaterialUseStock[] = [
    {
      id: 1,
      material_name: "資材1",
      stock_qty: 100,
      material_price: 1000,
      order_suggestion_qty: 100,
      use_stock: 1,
    },
    {
      id: 2,
      material_name: "資材2",
      stock_qty: 110,
      material_price: 1100,
      order_suggestion_qty: 100,
      use_stock: 2,
    },
    {
      id: 3,
      material_name: "資材3",
      stock_qty: 120,
      material_price: 1200,
      order_suggestion_qty: 100,
      use_stock: 3,
    },
    {
      id: 4,
      material_name: "資材4",
      stock_qty: 130,
      material_price: 1300,
      order_suggestion_qty: 100,
      use_stock: 4,
    },
    {
      id: 5,
      material_name: "資材5",
      stock_qty: 140,
      material_price: 1400,
      order_suggestion_qty: 100,
      use_stock: 5,
    },
  ];

  return (
    <Layout>
      <Box mt={4}>
        <MaterialUseStockTable columns={columns} data={data} />
      </Box>
    </Layout>
  );
};

export default MaterialsUse;
