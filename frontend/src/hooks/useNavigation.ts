import { User } from "@/domain/auth/user";
import { PageMap } from "@/domain/common/page-map";

const pageMap: PageMap = {
  // 資材管理画面
  materials_list: "/materials",
  materials_receive: (id: string) => `/materials/${id}/receive`,
  materials_use: (id: string) => `/materials/${id}/use`,

  // 勤怠管理画面
  attendance_list: "/attendance",
  attendance_create: "/attendance/create",
  attendance_by_user_id: (id: string) => `/attendance/${id}`,
  attendance_update: (id: string) => `/attendance/update/${id}`,

  // 生産管理画面
  production_plan_list: "/production_plan",
  production_plan_create: "/production_plan/create",
  production_plan_update: (id: string) => `/production_plan/update/${id}`,

  // 受注管理画面
  order_list: "/order",
  order_create: "/order/create",
  order_by_id: (id: string) => `/order/${id}`,
  order_update: (id: string) => `/order/update/${id}`,
  order_delete: (id: string) => `/order/delete/${id}`,

  // 不具合管理画面
  defect_list: "/defect",
  defect_create: "/defect/create",
  defect_by_id: (id: string) => `/defect/${id}`,
  defect_update: (id: string) => `/defect/update/${id}`,
  defect_delete: (id: string) => `/defect/delete/${id}`,

  // メール画面
  mail_list: "/mail",
  mail_create: "/mail/create",
  mail_by_id: (id: string) => `/mail/${id}`,
  mail_update: (id: string) => `/mail/update/${id}`,
  mail_delete: (id: string) => `/mail/delete/${id}`,
};

const accessMap: Record<
  string,
  { title: string; menu: { label: string; path: string }[] }
> = {
  material_access: {
    title: "資材管理",
    menu: [
      { label: "資材一覧", path: pageMap.materials_list },
      {
        label: "資材払い出し",
        path: pageMap.materials_use("dummy"),
      },
      {
        label: "資材受け入れ",
        path: pageMap.materials_receive("dummy"),
      },
    ],
  },
  can_manage_own_attendance: {
    title: "出勤簿管理",
    menu: [
      { label: "今日の出勤を入力", path: pageMap.attendance_create },
      {
        label: "自分の出勤状況を確認",
        path: pageMap.attendance_by_user_id("dummy"),
      },
      { label: "過去の出勤を編集", path: pageMap.attendance_update("dummy") },
    ],
  },
  can_manage_all_attendance: {
    title: "出勤簿管理",
    menu: [
      { label: "今日の出勤を入力", path: pageMap.attendance_create },
      { label: "全従業員の出勤を確認", path: pageMap.attendance_list },
      { label: "過去の出勤を編集", path: pageMap.attendance_update("dummy") },
      {
        label: "自分の出勤状況を確認",
        path: pageMap.attendance_by_user_id("dummy"),
      },
    ],
  },
  can_view_production_plan: {
    title: "生産計画管理",
    menu: [{ label: "生産計画を確認", path: pageMap.production_plan_list }],
  },
  can_edit_production_plan: {
    title: "生産計画管理",
    menu: [
      { label: "生産計画を確認", path: pageMap.production_plan_list },
      { label: "生産計画の新規登録", path: pageMap.production_plan_create },
      {
        label: "生産計画の編集",
        path: pageMap.production_plan_update("dummy"),
      },
    ],
  },
  can_view_order: {
    title: "受注管理",
    menu: [{ label: "受注を確認", path: pageMap.order_list }],
  },
  can_edit_order: {
    title: "受注管理",
    menu: [
      { label: "受注を確認", path: pageMap.order_list },
      { label: "受注の新規登録", path: pageMap.order_create },
      { label: "受注の編集", path: pageMap.order_update("dummy") },
      { label: "受注の削除", path: pageMap.order_delete("dummy") },
    ],
  },
  can_view_defect: {
    title: "不具合管理",
    menu: [{ label: "不具合を確認", path: pageMap.defect_list }],
  },
  can_edit_defect: {
    title: "不具合管理",
    menu: [
      { label: "不具合を確認", path: pageMap.defect_list },
      { label: "不具合の新規登録", path: pageMap.defect_create },
      { label: "不具合の編集", path: pageMap.defect_update("dummy") },
      { label: "不具合の削除", path: pageMap.defect_delete("dummy") },
    ],
  },
  mail_access: {
    title: "メール管理",
    menu: [
      { label: "メールを確認", path: pageMap.mail_list },
      { label: "メールの新規登録", path: pageMap.mail_create },
      { label: "メールの編集", path: pageMap.mail_update("dummy") },
      { label: "メールの削除", path: pageMap.mail_delete("dummy") },
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
