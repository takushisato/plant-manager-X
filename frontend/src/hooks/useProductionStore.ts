import { create } from "zustand";
// import { productionPlanList } from "@/fixtures/production";
import { ProductionPlanList, CreateProductionPlanRecord } from "@/types/production";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

type ProductionStore = {
  taskTitle: string;
  taskStartDate: string;
  taskEndDate: string;
  chartStartDate: Date;
  chartEndDate: Date;
  productionPlanList: ProductionPlanList;
  totalDays: number;
  currentEditTaskId: number | null;
  actualStartDate: string;
  actualEndDate: string;
  moveUp: (id: number) => void;
  moveDown: (id: number) => void;
  setActualStartDate: (date: string) => void;
  setActualEndDate: (date: string) => void;
  setCurrentEditTaskId: (id: number | null) => void;
  updateProductionPlanRecord: () => void;
  setTaskTitle: (title: string) => void;
  setTaskStartDate: (date: string) => void;
  setTaskEndDate: (date: string) => void;
  setChartStartDate: (date: Date) => void;
  setChartEndDate: (date: Date) => void;
  setProductionPlanList: (list: ProductionPlanList) => void;
  setTotalDays: (days: number) => void;
  getProductionPlanList: () => void;
  addProductionPlanRecord: () => void;
  dateToDayIndex: (date: Date | null) => number | null;
  parseLocalDate: (dateStr: string) => Date;
};

const today = new Date();

export const useProductionStore = create<ProductionStore>((set, get) => ({
  taskTitle: "",
  taskStartDate: "",
  taskEndDate: "",
  chartStartDate: new Date(today.setDate(today.getDate())),
  chartEndDate: new Date(today.setDate(today.getDate() + 60)),
  productionPlanList: {
    id: 0,
    organization: { organization_name: "", description: "" },
    plan_date: new Date(),
    note: "",
    records: [],
  },
  totalDays: 0,
  currentEditTaskId: null,
  actualStartDate: "",
  actualEndDate: "",
  setActualStartDate: (date: string) => set({ actualStartDate: date }),
  setActualEndDate: (date: string) => set({ actualEndDate: date }),
  setTaskTitle: (title: string) => set({ taskTitle: title }),
  setTaskStartDate: (date: string) => set({ taskStartDate: date }),
  setTaskEndDate: (date: string) => set({ taskEndDate: date }),
  setChartStartDate: (date: Date) => set({ chartStartDate: date }),
  setChartEndDate: (date: Date) => set({ chartEndDate: date }),
  setProductionPlanList: (list: ProductionPlanList) => set({ productionPlanList: list }),
  setTotalDays: (days: number) => set({ totalDays: days }),
  setCurrentEditTaskId: (id: number | null) => set({ currentEditTaskId: id }),

  /**
   * タスクを上に移動する
   * @param id タスクのID
   */
  moveUp: (id: number) => {
    const { productionPlanList } = get();
    const idx = productionPlanList.records.findIndex((r) => r.id === id);
    if (idx > 0) {
      const newRecords = [...productionPlanList.records];
      [newRecords[idx - 1], newRecords[idx]] = [newRecords[idx], newRecords[idx - 1]];
      // sort番号振り直し
      const updated = newRecords.map((record, i) => ({
        ...record,
        sort: i + 1,
      }));
      set({ productionPlanList: { ...productionPlanList, records: updated } });
    }
  },

  /**
   * タスクを下に移動する
   * @param id タスクのID
   */
  moveDown: (id: number) => {
    const { productionPlanList } = get();
    const idx = productionPlanList.records.findIndex((r) => r.id === id);
    if (idx < productionPlanList.records.length - 1) {
      const newRecords = [...productionPlanList.records];
      [newRecords[idx], newRecords[idx + 1]] = [newRecords[idx + 1], newRecords[idx]];
      const updated = newRecords.map((record, i) => ({
        ...record,
        sort: i + 1,
      }));
      set({ productionPlanList: { ...productionPlanList, records: updated } });
    }
  },

  /**
   * 日付からインデックスを取得する
   * @param date 日付
   * @returns インデックス
   */
  dateToDayIndex: (date: Date | null) => {
    if (!date) return null;
    const startDate = new Date(get().chartStartDate);
    return Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  },

  /**
   * 生産計画リストを取得する
   */
  getProductionPlanList: async () => {
    const response = await apiClient<ProductionPlanList[]>({
      url: endpoints.get.productionPlanList,
      method: "GET",
    });
    console.log(response);
    // TODO バックエンド側の見直し
    set({ productionPlanList: response[0] });
    // set({ productionPlanList: productionPlanList });
    const startDate = new Date(get().chartStartDate);
    const endDate = new Date(get().chartEndDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    set({ totalDays: diffDays });
  },

  /**
   * 生産計画リストに新しいレコードを追加する
   * TODO: APIにて実装する
   */
  addProductionPlanRecord: () => {
    const currentList = get().productionPlanList;
    const newId = currentList.records.length + 1;
    const newRecord: CreateProductionPlanRecord = {
      title: get().taskTitle,
      planned_start_date: get().parseLocalDate(get().taskStartDate),
      planned_end_date: get().parseLocalDate(get().taskEndDate),
      actual_start_date: get().actualStartDate ? get().parseLocalDate(get().actualStartDate) : null,
      actual_end_date: get().actualEndDate ? get().parseLocalDate(get().actualEndDate) : null,
      sort: newId,
      note: "",
    };
    set({
      productionPlanList: {
        ...currentList,
        records: [...currentList.records, { ...newRecord, id: newId }],
      },
    });
  },

  /**
   * 日付を日本の日付に変換する
   * @param dateStr 日付
   * @returns 日本の日付
   */
  parseLocalDate: (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day + 1);
  },

  /**
   * 生産計画リストを更新する
   * TODO: APIにて実装する
   */
  updateProductionPlanRecord: () => {
    const {
      productionPlanList,
      currentEditTaskId,
      taskTitle,
      taskStartDate,
      taskEndDate,
      parseLocalDate,
      actualStartDate,
      actualEndDate,
    } = get();
    if (currentEditTaskId === null) return;

    const updatedRecords = productionPlanList.records.map((record) =>
      record.id === currentEditTaskId
        ? {
            ...record,
            title: taskTitle,
            planned_start_date: parseLocalDate(taskStartDate),
            planned_end_date: parseLocalDate(taskEndDate),
            actual_start_date: actualStartDate ? parseLocalDate(actualStartDate) : null,
            actual_end_date: actualEndDate ? parseLocalDate(actualEndDate) : null,
          }
        : record
    );

    set({
      productionPlanList: {
        ...productionPlanList,
        records: updatedRecords,
      },
      currentEditTaskId: null,
    });
  },
}));
