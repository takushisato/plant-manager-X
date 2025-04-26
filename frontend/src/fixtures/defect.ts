import { DefectTableList, DefectItem } from "@/types/defect";

export const mockDefectTableList: DefectTableList[] = [
  {
    id: 1,
    create_user_name: "作成者1",
    order_number: "注文番号1",
    occurred_at: "2021-01-01",
    title: "タイトル1",
    defect_detail_button: "",
  },
  {
    id: 2,
    create_user_name: "作成者2",
    order_number: "注文番号2",
    occurred_at: "2021-01-02",
    title: "タイトル2",
    defect_detail_button: "",
  },
  {
    id: 3,
    create_user_name: "作成者3",
    order_number: "注文番号3",
    occurred_at: "2021-01-03",
    title: "タイトル3",
    defect_detail_button: "",
  },
];

export const mockDefectItem: DefectItem = {
  id: 1,
  title: "タイトル1",
  defect_detail: "不具合詳細1",
  submission: "対策1",
  submission_deadline: "2021-01-01",
  create_user: 1,
  order: 1,
  created_at: "2021-01-01",
  updated_at: "2021-01-01",
  occurred_at: "2021-01-01",
};
