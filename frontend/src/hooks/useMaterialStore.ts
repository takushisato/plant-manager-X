import { create } from "zustand";
import { MaterialList, MaterialReceiveStock, MaterialUseStock } from "@/types/material";
import { mockMaterialReceiveStock, mockMaterialUseStock } from "@/fixtures/material";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

type MaterialStore = {
  materialList: MaterialList[];
  setMaterialList: (materialList: MaterialList[]) => void;
  getMaterialList: () => Promise<void>;
  materialReceiveStock: MaterialReceiveStock[];
  setMaterialReceiveStock: (materialReceiveStock: MaterialReceiveStock[]) => void;
  getMaterialReceiveStock: () => Promise<void>;
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
   * 資材受け入れ一覧を取得する
   * TODO モックからAPIに変更する
   */
  getMaterialReceiveStock: async () => {
    const mockData = mockMaterialReceiveStock;
    set({ materialReceiveStock: mockData });
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
