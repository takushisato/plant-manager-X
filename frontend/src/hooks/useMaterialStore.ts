import { create } from "zustand";
import { MaterialList, MaterialReceiveStock, MaterialUseStock } from "@/types/material";
import { mockMaterialUseStock } from "@/fixtures/material";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

type MaterialStore = {
  materialList: MaterialList[];
  setMaterialList: (materialList: MaterialList[]) => void;
  getMaterialList: () => Promise<void>;
  materialReceiveStock: MaterialReceiveStock[];
  setMaterialReceiveStock: (materialReceiveStock: MaterialReceiveStock[]) => void;
  putMaterialReceiveStock: (id: number, quantity: number) => Promise<void>;
  materialUseStock: MaterialUseStock[];
  setMaterialUseStock: (materialUseStock: MaterialUseStock[]) => void;
  getMaterialUseStock: () => Promise<void>;
};

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
      url: endpoints.put.materialReceiveStock(id.toString()),
      method: "PUT",
      data: {
        quantity,
      },
    });
    set({ materialReceiveStock: response });
  },

  /**
   * 資材払い出し一覧を取得する
   * TODO モックからAPIに変更する
   */
  getMaterialUseStock: async () => {
    const mockData = mockMaterialUseStock;
    set({ materialUseStock: mockData });
  },
}));
