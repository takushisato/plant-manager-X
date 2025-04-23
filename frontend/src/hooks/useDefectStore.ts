import { create } from "zustand";
import { DefectTableList } from "@/types/defect";

type DefectStore = {
  defectList: DefectTableList[];
  getDefects: () => Promise<void>;
};

export const useDefectStore = create<DefectStore>((set) => ({
  defectList: [],

  /**
   * 不具合を取得
   * TODO モックからAPIに変更する
   */
  getDefects: async () => {
    const mockData: DefectTableList[] = [
      {
        id: 1,
        create_user_name: "作成者1",
        order_number: "注文番号1",
        occurred_at: "2021-01-01",
        title: "タイトル1",
        defect_detail_button: "",
      },
      {
        id: 2,
        create_user_name: "作成者2",
        order_number: "注文番号2",
        occurred_at: "2021-01-02",
        title: "タイトル2",
        defect_detail_button: "",
      },
      {
        id: 3,
        create_user_name: "作成者3",
        order_number: "注文番号3",
        occurred_at: "2021-01-03",
        title: "タイトル3",
        defect_detail_button: "",
      },
    ];
    set({ defectList: mockData });
  },
}));
