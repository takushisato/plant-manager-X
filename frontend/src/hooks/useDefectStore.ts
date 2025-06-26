import { create } from "zustand";
import { DefectTableList, DefectItem, DefectCreateItem } from "@/types/defect";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

type DefectStore = {
  defectList: DefectTableList[];
  defectItem: DefectItem;
  getDefects: () => Promise<void>;
  getDefect: (id: number) => Promise<void>;
  updateSubmission: (id: number, submission: string) => Promise<void>;
  createDefect: (defectItem: DefectCreateItem) => Promise<void>;
};

export const useDefectStore = create<DefectStore>((set) => ({
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
   * 不具合一覧を取得
   */
  getDefects: async () => {
    const response = await apiClient<DefectTableList[]>({
      url: endpoints.get.defectList,
      method: "GET",
    });
    set({ defectList: response });
  },

  /**
   * 不具合の詳細を取得
   */
  getDefect: async (id: number) => {
    const response = await apiClient<DefectItem>({
      url: endpoints.get.defectDetail(id),
      method: "GET",
    });
    set({ defectItem: response });
  },

  /**
   * 不具合を作成
   */
  createDefect: async (defectCreateItem: DefectCreateItem) => {
    console.log("defectCreateItem", defectCreateItem);
    alert("不具合を登録しました: " + JSON.stringify(defectCreateItem));
  },

  /**
   * 対策を申請
   */
  updateSubmission: async (id: number, submission: string) => {
    // const currentState = get();
    // set({ defectItem: { ...currentState.defectItem, submission } });
    // console.log("defectItem", id);
    // console.log("submission", submission);

    // TODO 動作確認
    const response = await apiClient<DefectItem>({
      url: endpoints.put.defectDetail(id),
      method: "PUT",
      data: { submission },
    });
    set({ defectItem: response });
  },
}));
