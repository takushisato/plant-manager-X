import { User } from "@/domain/auth/user";
import { PageMap } from "@/domain/common/page-map";

const pageMap: PageMap = {
  // マスタ設定画面
  get_master_data: "/master_data",
  create_master_data: "/master_data/create",
  update_master_data: (master_data_id: string) =>
    `/master_data/update/${master_data_id}`,
  delete_master_data: (master_data_id: string) =>
    `/master_data/delete/${master_data_id}`,

  // スタッフ画面
  get_staff_hub: "/staff_hub",
  create_staff_hub: "/staff_hub/create",
  update_staff_hub: (staff_hub_id: string) =>
    `/staff_hub/update/${staff_hub_id}`,
  delete_staff_hub: (staff_hub_id: string) =>
    `/staff_hub/delete/${staff_hub_id}`,

  // 材料画面
  get_material: "/material",
  create_material: "/material/create",
  update_material: (material_id: string) => `/material/update/${material_id}`,
  delete_material: (material_id: string) => `/material/delete/${material_id}`,

  // 勤怠管理画面
  get_attendance: "/attendance",
  create_attendance: "/attendance/create",
  get_attendance_by_user_id: (user_id: string) => `/attendance/${user_id}`,
  update_attendance: (user_id: string) => `/attendance/update/${user_id}`,
  delete_attendance: (user_id: string) => `/attendance/delete/${user_id}`,

  // 生産管理画面
  create_production_plan: "/production_plan/create",
  get_production_plan: "/production_plan",
  update_production_plan: (production_plan_id: string) =>
    `/production_plan/update/${production_plan_id}`,
  delete_production_plan: (production_plan_id: string) =>
    `/production_plan/delete/${production_plan_id}`,

  // 受注管理画面
  create_order: "/order/create",
  get_order: "/order",
  update_order: (order_id: string) => `/order/update/${order_id}`,
  delete_order: (order_id: string) => `/order/delete/${order_id}`,

  // 不具合管理画面
  create_defect: "/defect/create",
  get_defect: "/defect",
  update_defect: (defect_id: string) => `/defect/update/${defect_id}`,
  delete_defect: (defect_id: string) => `/defect/delete/${defect_id}`,

  // メール画面
  create_mail: "/mail/create",
  get_mail: "/mail",
  update_mail: (mail_id: string) => `/mail/update/${mail_id}`,
  delete_mail: (mail_id: string) => `/mail/delete/${mail_id}`,
};

const master_data_access = [
  pageMap.create_master_data,
  pageMap.get_master_data,
  pageMap.update_master_data,
  pageMap.delete_master_data,
];

const staff_hub_access = [
  pageMap.create_staff_hub,
  pageMap.get_staff_hub,
  pageMap.update_staff_hub,
  pageMap.delete_staff_hub,
];

const material_access = [
  pageMap.create_material,
  pageMap.get_material,
  pageMap.update_material,
  pageMap.delete_material,
];

const can_manage_own_attendance = [
  pageMap.create_attendance,
  pageMap.get_attendance_by_user_id,
  pageMap.update_attendance,
];

const can_manage_all_attendance = [
  pageMap.create_attendance,
  pageMap.get_attendance,
  pageMap.update_attendance,
  pageMap.get_attendance_by_user_id,
  pageMap.delete_attendance,
];

const can_view_production_plan = [pageMap.get_production_plan];

const can_edit_production_plan = [
  pageMap.create_production_plan,
  pageMap.update_production_plan,
  pageMap.delete_production_plan,
];

const can_view_order = [pageMap.get_order];

const can_edit_order = [
  pageMap.create_order,
  pageMap.update_order,
  pageMap.delete_order,
];

const can_view_defect = [pageMap.get_defect];

const can_edit_defect = [
  pageMap.get_defect,
  pageMap.create_defect,
  pageMap.update_defect,
  pageMap.delete_defect,
];

const mail_access = [
  pageMap.create_mail,
  pageMap.get_mail,
  pageMap.update_mail,
  pageMap.delete_mail,
];

export const useNavigation = () => {
  const navigateMenu = (user: User) => {
    if (user.permission.master_data_access) {
      return master_data_access;
    }
    if (user.permission.staff_hub_access) {
      return staff_hub_access;
    }
    if (user.permission.material_access) {
      return material_access;
    }
    if (user.permission.can_manage_own_attendance) {
      return can_manage_own_attendance;
    }
    if (user.permission.can_manage_all_attendance) {
      return can_manage_all_attendance;
    }
    if (user.permission.can_view_production_plan) {
      return can_view_production_plan;
    }
    if (user.permission.can_edit_production_plan) {
      return can_edit_production_plan;
    }
    if (user.permission.can_view_order) {
      return can_view_order;
    }
    if (user.permission.can_edit_order) {
      return can_edit_order;
    }
    if (user.permission.can_view_defect) {
      return can_view_defect;
    }
    if (user.permission.can_edit_defect) {
      return can_edit_defect;
    }
    if (user.permission.mail_access) {
      return mail_access;
    }
    return [];
  };

  return { navigateMenu };
};
