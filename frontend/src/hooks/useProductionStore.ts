import { create } from "zustand";
import { productionPlanList } from "@/fixtures/production";
import {
  ProductionPlanList,
  CreateProductionPlanRecord,
} from "@/types/production";

type ProductionStore = {
  chartStartDate: Date;
  chartEndDate: Date;
  productionPlanList: ProductionPlanList;
  totalDays: number;
  setChartStartDate: (date: Date) => void;
  setChartEndDate: (date: Date) => void;
  setProductionPlanList: (list: ProductionPlanList) => void;
  setTotalDays: (days: number) => void;
  getProductionPlanList: () => void;
  addProductionPlanRecord: (record: CreateProductionPlanRecord) => void;
  dateToDayIndex: (date: Date | null) => number | null;
};

const today = new Date();

export const useProductionStore = create<ProductionStore>((set, get) => ({
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
  setChartStartDate: (date: Date) => set({ chartStartDate: date }),
  setChartEndDate: (date: Date) => set({ chartEndDate: date }),
  setProductionPlanList: (list: ProductionPlanList) =>
    set({ productionPlanList: list }),
  setTotalDays: (days: number) => set({ totalDays: days }),

  /**
   * 日付をインデックスに変換する
   * @param date 日付
   * @returns インデックス
   */
  dateToDayIndex: (date: Date | null) => {
    if (!date) return null;
    const startDate = new Date(get().chartStartDate);
    return Math.floor(
      (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  },

  /**
   * 生産計画リストを取得する
   * TODO: 生産計画リストを取得するAPIを作成する
   */
  getProductionPlanList: () => {
    set({ productionPlanList: productionPlanList });
    const startDate = new Date(get().chartStartDate);
    const endDate = new Date(get().chartEndDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    set({ totalDays: diffDays });
  },

  /**
   * 生産計画リストに新しいレコードを追加する
   * @param record 新しいレコード
   */
  addProductionPlanRecord: (record: CreateProductionPlanRecord) => {
    const currentList = get().productionPlanList;
    const newId = currentList.records.length + 1;
    set({
      productionPlanList: {
        ...currentList,
        records: [...currentList.records, { ...record, id: newId }],
      },
    });
  },
}));
