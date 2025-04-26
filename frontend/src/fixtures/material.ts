import {
  MaterialList,
  MaterialReceiveStock,
  MaterialUseStock,
} from "@/types/material";

export const mockMaterialList: MaterialList[] = [
  {
    id: 1,
    material_name: "資材1",
    stock_qty: 100,
    material_price: 1000,
    order_suggestion_qty: 100,
  },
  {
    id: 2,
    material_name: "資材2",
    stock_qty: 200,
    material_price: 2000,
    order_suggestion_qty: 200,
  },
];

export const mockMaterialReceiveStock: MaterialReceiveStock[] = [
  {
    id: 1,
    material_name: "資材1",
    stock_qty: 100,
    material_price: 1000,
    order_suggestion_qty: 100,
    receive_stock: 1,
  },
  {
    id: 2,
    material_name: "資材2",
    stock_qty: 110,
    material_price: 1100,
    order_suggestion_qty: 100,
    receive_stock: 2,
  },
  {
    id: 3,
    material_name: "資材3",
    stock_qty: 120,
    material_price: 1200,
    order_suggestion_qty: 100,
    receive_stock: 3,
  },
  {
    id: 4,
    material_name: "資材4",
    stock_qty: 130,
    material_price: 1300,
    order_suggestion_qty: 100,
    receive_stock: 4,
  },
  {
    id: 5,
    material_name: "資材5",
    stock_qty: 140,
    material_price: 1400,
    order_suggestion_qty: 100,
    receive_stock: 5,
  },
];

export const mockMaterialUseStock: MaterialUseStock[] = [
  {
    id: 1,
    material_name: "資材1",
    stock_qty: 100,
    material_price: 1000,
    order_suggestion_qty: 100,
    use_stock: 1,
  },
  {
    id: 2,
    material_name: "資材2",
    stock_qty: 110,
    material_price: 1100,
    order_suggestion_qty: 100,
    use_stock: 2,
  },
  {
    id: 3,
    material_name: "資材3",
    stock_qty: 120,
    material_price: 1200,
    order_suggestion_qty: 100,
    use_stock: 3,
  },
  {
    id: 4,
    material_name: "資材4",
    stock_qty: 130,
    material_price: 1300,
    order_suggestion_qty: 100,
    use_stock: 4,
  },
  {
    id: 5,
    material_name: "資材5",
    stock_qty: 140,
    material_price: 1400,
    order_suggestion_qty: 100,
    use_stock: 5,
  },
];
