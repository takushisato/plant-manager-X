import { User } from "@/types/user";
import { Organization } from "@/types/organization";
import { SiteMap } from "@/types/common/site-map";
const siteMap: SiteMap = {
  // 資材管理画面
  materials_list: "/materials",
  materials_receive: (id: string) => `/materials/${id}/receive`,
  materials_use: (id: string) => `/materials/${id}/use`,

  // 勤怠管理画面
  attendance_list: "/attendance",
  attendance_by_user_id: (id: string) => `/attendance/${id}`,

  // 生産管理画面
  production_plan_list: "/production_plan",

  // 受注管理画面
  order_list: "/order",
  order_create: "/order/create",
  order_by_id: (id: string) => `/order/${id}`,
  order_update: (id: string) => `/order/${id}/update`,

  // 不具合管理画面
  defect_list: "/defect",
  defect_create: "/defect/create",

  // メール画面
  mail_list: "/mail",
  mail_create: "/mail/create",
};

const accessMap: Record<
  string,
  {
    title: string;
    menu:
      | { label: string; path: string }[]
      | ((param: User | Organization) => { label: string; path: string }[]);
  }
> = {
  material_access: {
    title: "資材管理",
    menu: (param: User | Organization) => {
      const organization = param as Organization;
      return [
        { label: "資材一覧", path: siteMap.materials_list },
        {
          label: "資材払い出し",
          path: siteMap.materials_use(organization.organization_name),
        },
        {
          label: "資材受け入れ",
          path: siteMap.materials_receive(organization.organization_name),
        },
      ];
    },
  },
  can_manage_own_attendance: {
    title: "出勤簿管理",
    menu: (param: User | Organization) => {
      const user = param as User;
      return [
        {
          label: "出勤簿",
          path: siteMap.attendance_by_user_id(String(user.id)),
        },
      ];
    },
  },
  can_manage_all_attendance: {
    title: "出勤簿管理",
    menu: (param: User | Organization) => {
      const user = param as User;
      return [
        { label: "全従業員の出勤を確認", path: siteMap.attendance_list },
        {
          label: "出勤簿",
          path: siteMap.attendance_by_user_id(String(user.id)),
        },
      ];
    },
  },
  can_view_production_plan: {
    title: "生産計画管理",
    menu: [{ label: "生産計画を確認", path: siteMap.production_plan_list }],
  },
  can_edit_production_plan: {
    title: "生産計画管理",
    menu: [{ label: "生産計画を確認", path: siteMap.production_plan_list }],
  },
  can_view_order: {
    title: "受注管理",
    menu: [{ label: "受注を確認", path: siteMap.order_list }],
  },
  can_edit_order: {
    title: "受注管理",
    menu: [
      { label: "受注を確認", path: siteMap.order_list },
      { label: "受注の新規登録", path: siteMap.order_create },
    ],
  },
  can_view_defect: {
    title: "不具合管理",
    menu: [{ label: "不具合を確認", path: siteMap.defect_list }],
  },
  can_edit_defect: {
    title: "不具合管理",
    menu: [
      { label: "不具合を確認", path: siteMap.defect_list },
      { label: "不具合の新規登録", path: siteMap.defect_create },
    ],
  },
  mail_access: {
    title: "メール管理",
    menu: [
      { label: "送信済みメールを確認", path: siteMap.mail_list },
      { label: "新規メールを作成", path: siteMap.mail_create },
    ],
  },
};

export const useNavigation = () => {
  const navigateMenu = (
    user: User,
    organization: Organization
  ): { title: string; menu: { label: string; path: string }[] }[] => {
    const accessiblePages: {
      title: string;
      menu: { label: string; path: string }[];
    }[] = [];

    for (const [key, pages] of Object.entries(accessMap)) {
      if (user.permission[key as keyof typeof user.permission]) {
        const menu =
          typeof pages.menu === "function"
            ? pages.menu(key === "material_access" ? organization : user)
            : pages.menu;
        accessiblePages.push({ title: pages.title, menu });
      }
    }

    return accessiblePages;
  };

  return { navigateMenu };
};
