import { Organization } from "@/types/organization";

export type ProductionPlanRecord = {
  id: number;
  title: string;
  planned_start_date: Date;
  planned_end_date: Date;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  sort: number;
  note: string | null;
};

export type ProductionPlanList = {
  id: number;
  organization: Organization;
  plan_date: Date;
  note: string | null;
  records: ProductionPlanRecord[];
};

export type CreateProductionPlanRecord = {
  title: string;
  planned_start_date: Date;
  planned_end_date: Date;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  sort: number;
  note: string | null;
};
  