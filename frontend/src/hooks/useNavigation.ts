import { User } from "@/domain/auth/user";
import { PageMap } from "@/domain/common/page-map";

const pageMap: PageMap = {
  // 資材管理画面
  get_material: "/material",
  create_material: "/material/create",
  update_material: (id: string) => `/material/update/${id}`,
  delete_material: (id: string) => `/material/delete/${id}`,

  // 勤怠管理画面
  get_attendance: "/attendance",
  create_attendance: "/attendance/create",
  get_attendance_by_user_id: (id: string) => `/attendance/${id}`,
  update_attendance: (id: string) => `/attendance/update/${id}`,
  delete_attendance: (id: string) => `/attendance/delete/${id}`,

  // 生産管理画面
  get_production_plan: "/production_plan",
  create_production_plan: "/production_plan/create",
  update_production_plan: (id: string) => `/production_plan/update/${id}`,
  delete_production_plan: (id: string) => `/production_plan/delete/${id}`,

  // 受注管理画面
  get_order: "/order",
  create_order: "/order/create",
  update_order: (id: string) => `/order/update/${id}`,
  delete_order: (id: string) => `/order/delete/${id}`,

  // 不具合管理画面
  get_defect: "/defect",
  create_defect: "/defect/create",
  update_defect: (id: string) => `/defect/update/${id}`,
  delete_defect: (id: string) => `/defect/delete/${id}`,

  // メール画面
  get_mail: "/mail",
  create_mail: "/mail/create",
  update_mail: (id: string) => `/mail/update/${id}`,
  delete_mail: (id: string) => `/mail/delete/${id}`,
};

const accessMap: Record<string, string[]> = {
  material_access: [pageMap.create_material, pageMap.get_material],
  can_manage_own_attendance: [
    pageMap.create_attendance,
    pageMap.get_attendance_by_user_id("dummy"),
    pageMap.update_attendance("dummy"),
  ],
  can_manage_all_attendance: [
    pageMap.create_attendance,
    pageMap.get_attendance,
    pageMap.update_attendance("dummy"),
    pageMap.get_attendance_by_user_id("dummy"),
    pageMap.delete_attendance("dummy"),
  ],
  can_view_production_plan: [pageMap.get_production_plan],
  can_edit_production_plan: [
    pageMap.get_production_plan,
    pageMap.create_production_plan,
    pageMap.update_production_plan("dummy"),
    pageMap.delete_production_plan("dummy"),
  ],
  can_view_order: [pageMap.get_order],
  can_edit_order: [
    pageMap.get_order,
    pageMap.create_order,
    pageMap.update_order("dummy"),
    pageMap.delete_order("dummy"),
  ],
  can_view_defect: [pageMap.get_defect],
  can_edit_defect: [
    pageMap.get_defect,
    pageMap.create_defect,
    pageMap.update_defect("dummy"),
    pageMap.delete_defect("dummy"),
  ],
  mail_access: [
    pageMap.get_mail,
    pageMap.create_mail,
    pageMap.update_mail("dummy"),
    pageMap.delete_mail("dummy"),
  ],
};

// マスター権限の場合は全てのページへのアクセス権限を持つ
const masterAccess = Array.from(new Set(Object.values(accessMap).flat()));

export const useNavigation = () => {
  const navigateMenu = (user: User): string[] => {
    if (user.permission.master_data_access) return masterAccess;

    const accessiblePages: string[] = [];

    for (const [key, pages] of Object.entries(accessMap)) {
      if (user.permission[key as keyof typeof user.permission]) {
        accessiblePages.push(...pages);
      }
    }

    return accessiblePages;
  };

  return { navigateMenu };
};
