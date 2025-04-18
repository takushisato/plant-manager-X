import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { MaterialList } from "@/domain/material/list";
import { Column } from "@/domain/common/generic-table";
import { Box } from "@chakra-ui/react";
const Materials = () => {
  // TODO モックからAPIに変更する
  const columns: Column<MaterialList>[] = [
    { header: "資材名", accessor: "material_name" },
    { header: "在庫数", accessor: "stock_qty" },
    { header: "価格", accessor: "material_price" },
    { header: "発注在庫数", accessor: "order_suggestion_qty" },
    { header: "在庫受け入れ", accessor: "receive_stock_page" },
    { header: "払い出し", accessor: "use_stock_page" },
  ];

  // TODO モックからAPIに変更する
  const data: MaterialList[] = [
    {
      id: 1,
      material_name: "資材1",
      stock_qty: 100,
      material_price: 1000,
      order_suggestion_qty: 100,
      receive_stock_page: "http://localhost:5173/materials/1/receive", // TODO idをモックからAPIに変更する
      use_stock_page: "http://localhost:5173/materials/1/use", // TODO idをモックからAPIに変更する
    },
    {
      id: 2,
      material_name: "資材2",
      stock_qty: 200,
      material_price: 2000,
      order_suggestion_qty: 200,
      receive_stock_page: "http://localhost:5173/materials/2/receive", // TODO idをモックからAPIに変更する
      use_stock_page: "http://localhost:5173/materials/2/use", // TODO idをモックからAPIに変更する
    },
  ];

  return (
    <Layout>
      <Box mt={4}>
        <GenericTable columns={columns} data={data} />
      </Box>
    </Layout>
  );
};

export default Materials;
