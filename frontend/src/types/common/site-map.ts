export type SiteMap = {
  // 材料画面
  materials_list: string;
  materials_receive: (material_id: string) => string;
  materials_use: (material_id: string) => string;

  // 勤怠管理画面
  attendance_list: string;
  attendance_by_user_id: (user_id: string) => string;

  // 生産管理画面
  production_plan_list: string;
  production_plan_create: string;
  production_plan_update: (production_plan_id: string) => string;

  // 受注管理画面
  order_list: string;
  order_create: string;
  order_by_id: (order_id: string) => string;
  order_update: (order_id: string) => string;

  // 不具合管理画面
  defect_create: string;
  defect_list: string;

  // メール画面
  mail_create: string;
  mail_list: string;
};
