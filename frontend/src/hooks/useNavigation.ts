import { User } from "@/domain/auth/user";
import { PageMap } from "@/domain/common/page-map";

const pageMap: PageMap = {
  // 資材管理画面
  get_material: "/materials",
  update_material_receive: (id: string) => `/materials/${id}/receive`,
  update_material_use: (id: string) => `/materials/${id}/use`,

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

const accessMap: Record<
  string,
  { title: string; menu: { label: string; path: string }[] }
> = {
  material_access: {
    title: "資材管理",
    menu: [
      { label: "資材一覧", path: pageMap.get_material },
      {
        label: "資材払い出し",
        path: pageMap.update_material_use("dummy"),
      },
      {
        label: "資材受け入れ",
        path: pageMap.update_material_receive("dummy"),
      },
    ],
  },
  can_manage_own_attendance: {
    title: "出勤簿管理",
    menu: [
      { label: "出勤簿を新規登録", path: pageMap.create_attendance },
      {
        label: "登録済みの出勤簿を確認",
        path: pageMap.get_attendance_by_user_id("dummy"),
      },
      { label: "出勤簿を編集", path: pageMap.update_attendance("dummy") },
    ],
  },
  can_manage_all_attendance: {
    title: "出勤簿管理",
    menu: [
      { label: "出勤簿を新規登録", path: pageMap.create_attendance },
      { label: "全従業員の出勤簿確認", path: pageMap.get_attendance },
      { label: "出勤簿を編集", path: pageMap.update_attendance("dummy") },
      {
        label: "出勤簿を確認",
        path: pageMap.get_attendance_by_user_id("dummy"),
      },
      { label: "出勤簿を削除", path: pageMap.delete_attendance("dummy") },
    ],
  },
  can_view_production_plan: {
    title: "生産計画管理",
    menu: [{ label: "生産計画を確認", path: pageMap.get_production_plan }],
  },
  can_edit_production_plan: {
    title: "生産計画管理",
    menu: [
      { label: "生産計画を確認", path: pageMap.get_production_plan },
      { label: "生産計画の新規登録", path: pageMap.create_production_plan },
      {
        label: "生産計画の編集",
        path: pageMap.update_production_plan("dummy"),
      },
      {
        label: "生産計画の削除",
        path: pageMap.delete_production_plan("dummy"),
      },
    ],
  },
  can_view_order: {
    title: "受注管理",
    menu: [{ label: "受注を確認", path: pageMap.get_order }],
  },
  can_edit_order: {
    title: "受注管理",
    menu: [
      { label: "受注を確認", path: pageMap.get_order },
      { label: "受注の新規登録", path: pageMap.create_order },
      { label: "受注の編集", path: pageMap.update_order("dummy") },
      { label: "受注の削除", path: pageMap.delete_order("dummy") },
    ],
  },
  can_view_defect: {
    title: "不具合管理",
    menu: [{ label: "不具合を確認", path: pageMap.get_defect }],
  },
  can_edit_defect: {
    title: "不具合管理",
    menu: [
      { label: "不具合を確認", path: pageMap.get_defect },
      { label: "不具合の新規登録", path: pageMap.create_defect },
      { label: "不具合の編集", path: pageMap.update_defect("dummy") },
      { label: "不具合の削除", path: pageMap.delete_defect("dummy") },
    ],
  },
  mail_access: {
    title: "メール管理",
    menu: [
      { label: "メールを確認", path: pageMap.get_mail },
      { label: "メールの新規登録", path: pageMap.create_mail },
      { label: "メールの編集", path: pageMap.update_mail("dummy") },
      { label: "メールの削除", path: pageMap.delete_mail("dummy") },
    ],
  },
};

export const useNavigation = () => {
  const navigateMenu = (
    user: User
  ): { title: string; menu: { label: string; path: string }[] }[] => {
    const accessiblePages: {
      title: string;
      menu: { label: string; path: string }[];
    }[] = [];

    for (const [key, pages] of Object.entries(accessMap)) {
      if (user.permission[key as keyof typeof user.permission]) {
        accessiblePages.push({ title: pages.title, menu: pages.menu });
      }
    }

    return accessiblePages;
  };

  return { navigateMenu };
};
