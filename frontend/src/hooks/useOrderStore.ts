import { create } from "zustand";
import { OrderTableItem, OrderTableList } from "@/types/order";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

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
  customer_id: number;
  setCustomerId: (value: number) => void;
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
  customer_id: 1,
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
  setCustomerId: (value: number) => set({ customer_id: value }),
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
   */
  getOrders: async () => {
    const response = await apiClient<OrderTableList[]>({
      url: endpoints.get.orderList,
      method: "GET",
    });
    set({ orders: response });
  },

  /**
   * 注文を取得
   * @param id
   */
  getOrder: async (id: number): Promise<void> => {
    console.log(id);
    const response = await apiClient<OrderTableItem>({
      url: endpoints.get.orderDetail(id),
      method: "GET",
    });
    set({ order: response });
  },

  /**
   * 注文を作成
   * @param get
   */
  createOrder: async (): Promise<void> => {
    const response = await apiClient<OrderTableItem>({
      url: endpoints.post.order,
      method: "POST",
      data: {
        customer: get().customer_id,
        // customer_name: get().customer_name,
        order_number: get().order_number,
        order_date: get().order_date,
        product_name: get().product_name,
        quantity: get().quantity,
        price: get().price,
        deadline: get().deadline,
        note: get().note,
      },
    });
    console.log(response);
  },

  /**
   * 注文を更新
   * @param id
   */
  updateOrder: async (id: number): Promise<void> => {
    // TODO: 顧客を選択できるようにする
    const response = await apiClient<OrderTableItem>({
      url: endpoints.put.orderDetail(id),
      method: "PUT",
      data: {
        id: id,
        customer: get().customer_id,
        // customer_name: get().customer_name,
        order_number: get().order_number,
        order_date: get().order_date,
        product_name: get().product_name,
        quantity: get().quantity,
        price: get().price,
        deadline: get().deadline,
        note: get().note,
      },
    });
    console.log(response);
  },
}));
