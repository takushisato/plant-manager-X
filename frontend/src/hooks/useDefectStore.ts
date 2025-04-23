import { create } from "zustand";
import { DefectTableList, DefectItem, DefectCreateItem } from "@/types/defect";

type DefectStore = {
  defectList: DefectTableList[];
  defectItem: DefectItem;
  getDefects: () => Promise<void>;
  getDefect: (id: number) => Promise<void>;
  updateSubmission: (id: number, submission: string) => Promise<void>;
  createDefect: (defectItem: DefectCreateItem) => Promise<void>;
};

export const useDefectStore = create<DefectStore>((set, get) => ({
  defectList: [],
  defectItem: {
    id: 0,
    created_at: "",
    updated_at: "",
    occurred_at: "",
    title: "",
    defect_detail: "",
    submission: "",
    submission_deadline: "",
    create_user: 0,
    order: 0,
  },

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

  /**
   * 不具合の詳細を取得
   * TODO モックからAPIに変更する
   */
  getDefect: async (id: number) => {
    const mockData: DefectItem = {
      id: 1,
      title: "タイトル1",
      defect_detail: "不具合詳細1",
      submission: "対策1",
      submission_deadline: "2021-01-01",
      create_user: 1,
      order: 1,
      created_at: "2021-01-01",
      updated_at: "2021-01-01",
      occurred_at: "2021-01-01",
    };
    set({ defectItem: mockData });
    console.log("defectItem", id);
  },

  /**
   * 不具合を作成
   */
  createDefect: async (defectCreateItem: DefectCreateItem) => {
    console.log("defectCreateItem", defectCreateItem);
    alert("不具合を登録しました: " + JSON.stringify(defectCreateItem));
  },

  /**
   * 不具合を更新
   */
  updateSubmission: async (id: number, submission: string) => {
    const currentState = get();
    set({ defectItem: { ...currentState.defectItem, submission } });
    console.log("defectItem", id);
    console.log("submission", submission);
  },
}));
