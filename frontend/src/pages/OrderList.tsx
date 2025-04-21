import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import type { OrderTableList } from "@/types/order";
import { Column } from "@/types/common/generic-table";
import { Box } from "@chakra-ui/react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useEffect } from "react";
const OrderList = () => {
  const { orders, getOrders } = useOrderStore();

  useEffect(() => {
    getOrders();
  }, []);

  const columns: Column<OrderTableList>[] = [
    { header: "顧客名", accessor: "customer_name" },
    { header: "注文番号", accessor: "order_number" },
    { header: "注文日", accessor: "order_date" },
    { header: "商品名", accessor: "product_name" },
    { header: "数量", accessor: "quantity" },
    { header: "価格", accessor: "price" },
    { header: "納期", accessor: "deadline" },
    { header: "備考", accessor: "note" },
  ];

  return (
    <Layout>
      <Box mt={4}>
        <GenericTable columns={columns} data={orders} />
      </Box>
    </Layout>
  );
};

export default OrderList;
