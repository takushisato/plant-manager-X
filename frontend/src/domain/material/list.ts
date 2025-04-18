export type MaterialList = {
  id: number;
  material_name: string;
  material_price: number;
  stock_qty: number;
  order_suggestion_qty: number;
};

export type MaterialUseStock = {
  id: number;
  material_name: string;
  material_price: number;
  stock_qty: number;
  order_suggestion_qty: number;
  use_stock: number;
};

export type MaterialReceiveStock = {
  id: number;
  material_name: string;
  material_price: number;
  stock_qty: number;
  order_suggestion_qty: number;
  receive_stock_page: number;
};
  