import Layout from "@/layouts/Layout";
import MaterialUseStockTable from "@/components/material/MaterialUseStockTable";
import { MaterialUseStock } from "@/types/material";
import { Column } from "@/types/common/generic-table";
import { Box } from "@chakra-ui/react";
import { useMaterialStore } from "@/hooks/useMaterialStore";
import { useEffect } from "react";

const MaterialsUse = () => {
  const { materialList, getMaterialList, putMaterialUseStock } = useMaterialStore();

  const columns: Column<MaterialUseStock>[] = [
    { header: "資材名", accessor: "material_name" },
    { header: "在庫数", accessor: "stock_qty" },
    { header: "価格", accessor: "material_price" },
    { header: "発注在庫数", accessor: "order_suggestion_qty" },
    { header: "払い出し", accessor: "use_stock" },
  ];

  useEffect(() => {
    getMaterialList();
  }, []);

  const materialUseStock = materialList.map((material) => ({
    ...material,
    use_stock: material.stock_qty,
  }));

  return (
    <Layout>
      <Box mt={4}>
        <MaterialUseStockTable
          columns={columns}
          data={materialUseStock}
          putMaterialUseStock={putMaterialUseStock}
          getMaterialList={getMaterialList}
        />
      </Box>
    </Layout>
  );
};

export default MaterialsUse;
