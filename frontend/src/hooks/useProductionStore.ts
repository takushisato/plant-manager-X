import { create } from "zustand";
import { productionPlanList } from "@/fixtures/production";
import { ProductionPlanList } from "@/types/production";

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
  dateToDayIndex: (date: Date | null) => number | null;
};

export const useProductionStore = create<ProductionStore>((set, get) => ({
  chartStartDate: new Date(),
  chartEndDate: new Date(),
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

  dateToDayIndex: (date: Date | null) => {
    if (!date) return null;
    const startDate = new Date(get().chartStartDate);
    return Math.floor(
      (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  },

  getProductionPlanList: () => {
    const list = productionPlanList;

    const today = new Date();
    const chartStart = new Date(today);
    chartStart.setDate(today.getDate());

    const chartEnd = new Date(today);
    chartEnd.setDate(today.getDate() + 60);

    const days =
      (chartEnd.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24) + 1;

    set({
      productionPlanList: list,
      chartStartDate: chartStart,
      chartEndDate: chartEnd,
      totalDays: days,
    });
  },
}));
