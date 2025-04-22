import Layout from "@/layouts/Layout";
import OrderCreateForm from "@/components/order/OrderCreateForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const OrderUpdate = () => {
  const { id } = useParams();
  const [orderId, setOrderId] = useState<string | undefined>(id);

  useEffect(() => {
    setOrderId(id);
  }, [id]);

  return (
    <Layout>
      <OrderCreateForm id={orderId} />
    </Layout>
  );
};

export default OrderUpdate;
