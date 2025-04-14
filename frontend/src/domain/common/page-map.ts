export type PageMap = {
  // 材料画面
  get_material: string;
  create_material: string;
  update_material: (material_id: string) => string;
  delete_material: (material_id: string) => string;

  // 勤怠管理画面
  get_attendance: string;
  create_attendance: string;
  get_attendance_by_user_id: (user_id: string) => string;
  update_attendance: (user_id: string) => string;
  delete_attendance: (user_id: string) => string;

  // 生産管理画面
  create_production_plan: string;
  get_production_plan: string;
  update_production_plan: (production_plan_id: string) => string;
  delete_production_plan: (production_plan_id: string) => string;

  // 受注管理画面
  create_order: string;
  get_order: string;
  update_order: (order_id: string) => string;
  delete_order: (order_id: string) => string;

  // 不具合管理画面
  create_defect: string;
  get_defect: string;
  update_defect: (defect_id: string) => string;
  delete_defect: (defect_id: string) => string;

  // メール画面
  create_mail: string;
  get_mail: string;
  update_mail: (mail_id: string) => string;
  delete_mail: (mail_id: string) => string;
};
