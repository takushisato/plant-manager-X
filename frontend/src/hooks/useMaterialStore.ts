import { create } from "zustand";
import { MaterialList } from "@/types/material";
import { mockMaterialList } from "@/fixtures/material";

type MaterialStore = {
  materialList: MaterialList[];
  setMaterialList: (materialList: MaterialList[]) => void;
  getMaterialList: () => Promise<void>;
};

export const useMaterialStore = create<MaterialStore>((set) => ({
  materialList: [],
  setMaterialList: (materialList: MaterialList[]) => set({ materialList }),

  /**
   * 資材一覧を取得する
   * TODO モックからAPIに変更する
   */
  getMaterialList: async () => {
    const mockData = mockMaterialList;
    set({ materialList: mockData });
  },
}));
