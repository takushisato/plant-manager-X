import { create } from "zustand";
import { OrderCreate, OrderTableItem, OrderTableList } from "@/types/order";

type OrderStore = {
  customer_name: string;
  order_number: string;
  order_date: string;
  product_name: string;
  quantity: number;
  price: number;
  deadline: string;
  note: string;
  orders: OrderTableList[];
  order: OrderTableItem;
  setOrders: (orders: OrderTableList[]) => void;
  createOrder: () => void;
  getOrders: () => Promise<void>;
  setCustomerName: (value: string) => void;
  setOrderNumber: (value: string) => void;
  setOrderDate: (value: string) => void;
  setProductName: (value: string) => void;
  setQuantity: (value: number) => void;
  setPrice: (value: number) => void;
  setDeadline: (value: string) => void;
  setNote: (value: string) => void;
  getOrder: (id: number) => Promise<void>;
  updateOrder: (id: number) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  customer_name: "",
  order_number: "",
  order_date: "",
  product_name: "",
  quantity: 0,
  price: 0,
  deadline: "",
  note: "",
  orders: [],
  order: {
    id: 0,
    customer_name: "",
    order_number: "",
    order_date: "",
    product_name: "",
    quantity: 0,
    price: 0,
    deadline: "",
    note: "",
  },
  setOrders: (orders: OrderTableList[]) => set({ orders }),
  setCustomerName: (value: string) => set({ customer_name: value }),
  setOrderNumber: (value: string) => set({ order_number: value }),
  setOrderDate: (value: string) => set({ order_date: value }),
  setProductName: (value: string) => set({ product_name: value }),
  setQuantity: (value: number) => set({ quantity: value }),
  setPrice: (value: number) => set({ price: value }),
  setDeadline: (value: string) => set({ deadline: value }),
  setNote: (value: string) => set({ note: value }),

  /**
   * 注文を取得
   * TODO モックからAPIに変更する
   */
  getOrders: async () => {
    const mockData: OrderTableList[] = [
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
        order_update_button: "",
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
        order_update_button: "",
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
        order_update_button: "",
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
        order_update_button: "",
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
        order_update_button: "",
      },
    ];
    set({ orders: mockData });
  },

  /**
   * 注文を取得
   * @param id
   */
  getOrder: async (id: number): Promise<void> => {
    const mockData: OrderTableItem = {
      id: 1,
      customer_name: "updare顧客1",
      order_number: "updare注文番号1",
      order_date: "2021-01-01",
      product_name: "updare商品名1",
      quantity: 100,
      price: 1000,
      deadline: "2021-01-01",
      note: "updare備考1",
    };
    set({ order: mockData });
    console.log("注文を取得しました" + id);
  },

  /**
   * 注文を作成
   * @param get
   */
  createOrder: async (): Promise<void> => {
    const order: OrderCreate = {
      customer_name: get().customer_name,
      order_number: get().order_number,
      order_date: get().order_date,
      product_name: get().product_name,
      quantity: get().quantity,
      price: get().price,
      deadline: get().deadline,
      note: get().note,
    };

    alert("注文を作成しました" + JSON.stringify(order));
  },

  /**
   * 注文を更新
   * @param id
   */
  updateOrder: async (id: number): Promise<void> => {
    alert("注文を更新しました" + id);
  },
}));
