import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { OrderCreate } from "@/types/order";
import { useOrderStore } from "@/hooks/useOrderStore";

const OrderCreateForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const { createOrder } = useOrderStore();

  const [order, setOrder] = useState<OrderCreate>({
    customer_name: "",
    order_number: "",
    order_date: today,
    product_name: "",
    quantity: 0,
    price: 0,
    deadline: "",
    note: "",
  });

  /**
   * 注文を作成
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder(order);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%" maxW="1200px" mx="auto">
      <FormControl>
        <FormLabel>顧客名</FormLabel>
        <Input
          type="text"
          value={order.customer_name}
          onChange={(e) =>
            setOrder({ ...order, customer_name: e.target.value })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>注文番号</FormLabel>
        <Input
          type="text"
          value={order.order_number}
          onChange={(e) => setOrder({ ...order, order_number: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>注文日</FormLabel>
        <Input
          type="date"
          value={order.order_date}
          onChange={(e) => setOrder({ ...order, order_date: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>商品名</FormLabel>
        <Input
          type="text"
          value={order.product_name}
          onChange={(e) => setOrder({ ...order, product_name: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>数量</FormLabel>
        <Input
          type="number"
          value={order.quantity}
          onChange={(e) =>
            setOrder({ ...order, quantity: parseInt(e.target.value) })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>価格</FormLabel>
        <Input
          type="number"
          value={order.price}
          onChange={(e) =>
            setOrder({ ...order, price: parseInt(e.target.value) })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>納期</FormLabel>
        <Input
          type="date"
          value={order.deadline}
          onChange={(e) => setOrder({ ...order, deadline: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>備考</FormLabel>
        <Input
          type="text"
          value={order.note}
          onChange={(e) => setOrder({ ...order, note: e.target.value })}
        />
      </FormControl>
      <Button type="submit" mt={4}>
        作成
      </Button>
    </Box>
  );
};

export default OrderCreateForm;
