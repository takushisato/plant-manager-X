import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import { create } from "zustand";

type Customer = {
  id: number;
  customer_name: string;
};

type CustomerStore = {
  customers: Customer[];
  getCustomers: () => void;
};

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],

  /**
   * 顧客一覧を取得する
   */
  getCustomers: async () => {
    const response = await apiClient<Customer[]>({
      url: endpoints.get.customers,
      method: "GET",
    });
    console.log("顧客一覧:", response);
    set({ customers: response });
  },
}));
