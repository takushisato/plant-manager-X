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
    occurred_at_raw: "",
    submission_deadline_raw: "",
  },

  /**
   * 不具合一覧を取得
   */
  getDefects: async () => {
    const response = await apiClient<DefectTableList[]>({
      url: endpoints.get.defectList,
      method: "GET",
    });
    const formatted = response.map((item) => ({
      ...item,
      occurred_at: item.occurred_at
        ? new Date(item.occurred_at)
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "/")
        : "",
    }));
    console.log("Fetched defects:", formatted);
    set({ defectList: formatted });
  },

  /**
   * 不具合の詳細を取得
   */
  getDefect: async (id: number) => {
    const response = await apiClient<DefectItem>({
      url: endpoints.get.defectDetail(id),
      method: "GET",
    });
    const formatted = {
      ...response,
      occurred_at: response.occurred_at,
      submission_deadline: response.submission_deadline,
      occurred_at_raw: response.occurred_at
        ? new Date(response.occurred_at)
            .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
            .replace(/\//g, "/")
        : "",
      submission_deadline_raw: response.submission_deadline
        ? new Date(response.submission_deadline)
            .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
            .replace(/\//g, "/")
        : "",
    };
    set({ defectItem: formatted });
  },

  /**
   * 不具合を作成
   */
  createDefect: async (defectCreateItem: DefectCreateItem) => {
    const response = await apiClient<DefectItem>({
      url: endpoints.post.defectCreate,
      method: "POST",
      data: defectCreateItem,
    });
    console.log("Defect created:", response);
  },

  /**
   * 対策を申請
   */
  updateSubmission: async (id: number, submission: string) => {
    const currentState = get();
    const response = await apiClient<DefectItem>({
      url: endpoints.put.defectDetail(id),
      method: "PUT",
      data: {
        defect_detail: currentState.defectItem.defect_detail,
        occurred_at: currentState.defectItem.occurred_at,
        submission: submission,
        order: currentState.defectItem.order,
        submission_deadline: currentState.defectItem.submission_deadline,
        title: currentState.defectItem.title,
      },
    });
    set({ defectItem: response });
  },
}));
