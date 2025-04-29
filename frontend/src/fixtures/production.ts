import { ProductionPlanList, ProductionPlanRecord } from "@/types/production";

const productionPlanRecords: ProductionPlanRecord[] = [
  {
    id: 1,
    title: "材料準備",
    planned_start_date: new Date("2025-05-01"),
    planned_end_date: new Date("2025-05-05"),
    actual_start_date: new Date("2025-05-02"),
    actual_end_date: new Date("2025-05-06"),
    sort: 1,
    note: "備考",
  },
  {
    id: 2,
    title: "組立作業",
    planned_start_date: new Date("2025-05-06"),
    planned_end_date: new Date("2025-05-12"),
    actual_start_date: null,
    actual_end_date: null,
    sort: 2,
    note: "備考",
  },
  {
    id: 3,
    title: "検査工程",
    planned_start_date: new Date("2025-05-13"),
    planned_end_date: new Date("2025-05-16"),
    actual_start_date: null,
    actual_end_date: null,
    sort: 3,
    note: "備考",
  },
];

export const productionPlanList: ProductionPlanList = {
  id: 1,
  organization: {
    organization_name: "組織1",
    description: "備考",
  },
  plan_date: new Date("2025-05-01"),
  note: "備考",
  records: productionPlanRecords,
};
