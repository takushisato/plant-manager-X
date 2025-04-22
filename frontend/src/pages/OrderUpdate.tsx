import Layout from "@/layouts/Layout";
import OrderForm from "@/components/order/OrderForm";
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
      <OrderForm id={orderId} />
    </Layout>
  );
};

export default OrderUpdate;
