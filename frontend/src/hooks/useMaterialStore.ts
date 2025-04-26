import { create } from "zustand";
import { MaterialList, MaterialReceiveStock } from "@/types/material";
import {
  mockMaterialList,
  mockMaterialReceiveStock,
} from "@/fixtures/material";

type MaterialStore = {
  materialList: MaterialList[];
  setMaterialList: (materialList: MaterialList[]) => void;
  getMaterialList: () => Promise<void>;
  materialReceiveStock: MaterialReceiveStock[];
  setMaterialReceiveStock: (
    materialReceiveStock: MaterialReceiveStock[]
  ) => void;
  getMaterialReceiveStock: () => Promise<void>;
};

export const useMaterialStore = create<MaterialStore>((set) => ({
  materialList: [],
  setMaterialList: (materialList: MaterialList[]) => set({ materialList }),
  materialReceiveStock: [],
  setMaterialReceiveStock: (materialReceiveStock: MaterialReceiveStock[]) =>
    set({ materialReceiveStock }),

  /**
   * 資材一覧を取得する
   * TODO モックからAPIに変更する
   */
  getMaterialList: async () => {
    const mockData = mockMaterialList;
    set({ materialList: mockData });
  },

  /**
   * 資材受け入れ一覧を取得する
   * TODO モックからAPIに変更する
   */
  getMaterialReceiveStock: async () => {
    const mockData = mockMaterialReceiveStock;
    set({ materialReceiveStock: mockData });
  },
}));
