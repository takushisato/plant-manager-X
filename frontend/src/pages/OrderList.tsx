import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import type { OrderTableList } from "@/types/order";
import { Column } from "@/types/common/generic-table";
import { Box } from "@chakra-ui/react";
const OrderList = () => {
  // TODO モックからAPIに変更する
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

  // TODO モックからAPIに変更する
  const data: OrderTableList[] = [
    {
      id: 1,
      customer_name: "顧客1",
      order_number: "注文番号1",
      order_date: "2021-01-01",
      product_name: "商品名1",
      quantity: 100,
      price: 1000,
      deadline: "2021-01-01",
      note: "備考1",
    },
    {
      id: 2,
      customer_name: "顧客2",
      order_number: "注文番号2",
      order_date: "2021-01-02",
      product_name: "商品名2",
      quantity: 200,
      price: 2000,
      deadline: "2021-01-02",
      note: "備考2",
    },
    {
      id: 3,
      customer_name: "顧客3",
      order_number: "注文番号3",
      order_date: "2021-01-03",
      product_name: "商品名3",
      quantity: 300,
      price: 3000,
      deadline: "2021-01-03",
      note: "備考3",
    },
    {
      id: 4,
      customer_name: "顧客4",
      order_number: "注文番号4",
      order_date: "2021-01-04",
      product_name: "商品名4",
      quantity: 400,
      price: 4000,
      deadline: "2021-01-04",
      note: "備考4",
    },
    {
      id: 5,
      customer_name: "顧客5",
      order_number: "注文番号5",
      order_date: "2021-01-05",
      product_name: "商品名5",
      quantity: 500,
      price: 5000,
      deadline: "2021-01-05",
      note: "備考5",
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

export default OrderList;
