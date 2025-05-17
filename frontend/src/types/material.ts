export type MaterialStore = {
  materialList: MaterialList[];
  setMaterialList: (materialList: MaterialList[]) => void;
  getMaterialList: () => Promise<void>;
  materialReceiveStock: MaterialReceiveStock[];
  setMaterialReceiveStock: (materialReceiveStock: MaterialReceiveStock[]) => void;
  putMaterialReceiveStock: (id: number, quantity: number) => Promise<void>;
  materialUseStock: MaterialUseStock[];
  setMaterialUseStock: (materialUseStock: MaterialUseStock[]) => void;
  putMaterialUseStock: (id: number, quantity: number) => Promise<void>;
};

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
  receive_stock: number;
};
