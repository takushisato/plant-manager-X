import { create } from "zustand";
import { MaterialList, MaterialReceiveStock, MaterialUseStock, MaterialStore } from "@/types/material";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

export const useMaterialStore = create<MaterialStore>((set) => ({
  materialList: [],
  setMaterialList: (materialList: MaterialList[]) => set({ materialList }),
  materialReceiveStock: [],
  setMaterialReceiveStock: (materialReceiveStock: MaterialReceiveStock[]) => set({ materialReceiveStock }),
  materialUseStock: [],
  setMaterialUseStock: (materialUseStock: MaterialUseStock[]) => set({ materialUseStock }),

  /**
   * 資材一覧を取得
   * （ユーザーの所属している組織のもののみ取得可能になっている）
   */
  getMaterialList: async () => {
    const response = await apiClient<MaterialList[]>({
      url: endpoints.get.materialList,
      method: "GET",
    });
    set({ materialList: response });
  },

  /**
   * 資材受け入れ処理
   */
  putMaterialReceiveStock: async (id: number, quantity: number) => {
    const response = await apiClient<MaterialReceiveStock[]>({
      url: endpoints.put.materialReceiveStock(id),
      method: "PUT",
      data: {
        quantity,
      },
    });
    set({ materialReceiveStock: response });
  },

  /**
   * 資材払い出し処理
   */
  putMaterialUseStock: async (id: number, quantity: number) => {
    const response = await apiClient<MaterialUseStock[]>({
      url: endpoints.put.materialUseStock(id),
      method: "PUT",
      data: {
        quantity,
      },
    });
    set({ materialUseStock: response });
  },
}));
