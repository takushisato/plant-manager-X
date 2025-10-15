import { Box, FormControl, FormLabel, Input, Button, Select } from "@chakra-ui/react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import InputWithTooltip from "@/components/common/InputWithTooltip";
import { useCustomerStore } from "@/hooks/useCustomerStore";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const {
    createOrder,
    customer_id,
    order_number,
    order_date,
    product_name,
    quantity,
    price,
    deadline,
    note,
    setCustomerId,
    setOrderNumber,
    setOrderDate,
    setProductName,
    setQuantity,
    setPrice,
    setDeadline,
    setNote,
    order,
    getOrder,
    updateOrder,
  } = useOrderStore();

  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * idが存在する場合は注文を取得
   */
  useEffect(() => {
    if (id) {
      getOrder(Number(id));
      setCustomerId(order.customer_id);
    } else {
      setCustomerId(0);
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

  const { customers, getCustomers } = useCustomerStore();

  useEffect(() => {
    getCustomers();
  }, []);

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
   * 注文を作成または更新
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateOrder(Number(id));
    } else {
      createOrder();
    }
    navigate("/order");
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%" maxW="1200px" mx="auto" data-testid="order-form" mt={4}>
      <FormControl>
        <Select value={customer_id} onChange={(e) => setCustomerId(Number(e.target.value))} isRequired={true}>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.customer_name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputWithTooltip
          label="注文番号"
          name="order_number"
          tooltip="未入力の場合は自動生成されます"
          type="text"
          value={order_number}
          onChange={(e) => setOrderNumber(e.target.value)}
          isRequired={false}
        />
      </FormControl>
      <FormControl>
        <InputWithTooltip
          label="注文日"
          name="order_date"
          tooltip="今日の日付が自動設定されますが、必要に応じて変更してください"
          type="date"
          value={order_date}
          onChange={(e) => setOrderDate(e.target.value)}
          isRequired={true}
        />
      </FormControl>
      <FormControl>
        <InputWithTooltip
          label="商品名"
          name="product_name"
          tooltip="商品名を入力してください"
          type="text"
          value={product_name}
          onChange={(e) => setProductName(e.target.value)}
          isRequired={true}
        />
      </FormControl>
      <FormControl>
        <InputWithTooltip
          label="数量"
          name="quantity"
          tooltip="半角数字で入力してください"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          isRequired={true}
        />
      </FormControl>
      <FormControl>
        <InputWithTooltip
          label="価格"
          name="price"
          tooltip="半角数字で入力してください"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
          isRequired={true}
        />
      </FormControl>
      <FormControl>
        <InputWithTooltip
          label="納期"
          name="deadline"
          tooltip="客先と合意した納期を入力してください"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          isRequired={true}
        />
      </FormControl>
      <FormControl>
        <FormLabel>備考</FormLabel>
        <Input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
      </FormControl>
      <Button type="submit" mt={4}>
        {id ? "更新" : "作成"}
      </Button>
    </Box>
  );
};

export default OrderForm;
