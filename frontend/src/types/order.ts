export type OrderTableList = {
  id: number;
  customer_name: string;
  order_number: string;
  order_date: string;
  product_name: string;
  quantity: number;
  price: number;
  deadline: string;
  note: string;
  order_update_button: string;
};

export type OrderCreate = {
  customer_name: string;
  order_number: string;
  order_date: string;
  product_name: string;
  quantity: number;
  price: number;
  deadline: string;
  note: string;
};