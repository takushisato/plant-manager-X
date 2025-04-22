import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const OrderForm = () => {
  const {
    createOrder,
    customer_name,
    order_number,
    order_date,
    product_name,
    quantity,
    price,
    deadline,
    note,
    setCustomerName,
    setOrderNumber,
    setOrderDate,
    setProductName,
    setQuantity,
    setPrice,
    setDeadline,
    setNote,
    order,
    getOrder,
  } = useOrderStore();

  const { id } = useParams();

  /**
   * idが存在する場合は注文を取得
   */
  useEffect(() => {
    if (id) {
      getOrder(Number(id));
    } else {
      setCustomerName("");
      setOrderNumber("");
      setOrderDate("");
      setProductName("");
      setQuantity(0);
      setPrice(0);
      setDeadline("");
      setNote("");
    }
  }, [id]);

  useEffect(() => {
    if (id && order.customer_name) {
      setCustomerName(order.customer_name);
      setOrderNumber(order.order_number);
      setOrderDate(order.order_date);
      setProductName(order.product_name);
      setQuantity(order.quantity);
      setPrice(order.price);
      setDeadline(order.deadline);
      setNote(order.note);
      console.log("取得後の注文:", order);
    }
  }, [order, id]);

  /**
   * 注文日が未入力の場合（主に新規作成時）デフォルトで今日の日付を設定
   */
  useEffect(() => {
    if (!order_date) {
      const today = new Date().toISOString().split("T")[0];
      setOrderDate(today);
    }
  }, [order_date, setOrderDate]);

  /**
   * 注文を作成
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder();
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      w="100%"
      maxW="1200px"
      mx="auto"
      data-testid="order-form"
    >
      <FormControl>
        <FormLabel>顧客名</FormLabel>
        <Input
          type="text"
          value={customer_name}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>注文番号</FormLabel>
        <Input
          type="text"
          value={order_number}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>注文日</FormLabel>
        <Input
          type="date"
          value={order_date}
          onChange={(e) => setOrderDate(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>商品名</FormLabel>
        <Input
          type="text"
          value={product_name}
          onChange={(e) => setProductName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>数量</FormLabel>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </FormControl>
      <FormControl>
        <FormLabel>価格</FormLabel>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
        />
      </FormControl>
      <FormControl>
        <FormLabel>納期</FormLabel>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>備考</FormLabel>
        <Input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </FormControl>
      <Button type="submit" mt={4}>
        作成
      </Button>
    </Box>
  );
};

export default OrderForm;
