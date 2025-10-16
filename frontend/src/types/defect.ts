export type DefectItem = {
  id: number;
  created_at: string;
  updated_at: string;
  occurred_at: string;
  title: string;
  defect_detail: string;
  submission: string;
  submission_deadline: string;
  create_user: number;
  order: number;
  occurred_at_raw: string;
  submission_deadline_raw: string;
};

export type DefectTableList = {
  id: number;
  create_user_name: string;
  order_number: string;
  occurred_at: string;
  title: string;
  defect_detail_button: string;
};

export type DefectCreateItem = {
  occurred_at: string;
  title: string;
  defect_detail: string;
  submission: string;
  submission_deadline: string;
  create_user: number;
  order: number;
};
