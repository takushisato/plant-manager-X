import { User } from "./user";

export type MailGroupList = {
  id: number;
  group_title: string;
  note: string;
  records: {
    recipient_user: number;
    recipient_user_name: string;
  }[];
};

export type MailGroup = {
  group_title: string;
  note: string;
  recipient_users: User[];
};

export type MailPost = {
  group_id: number;
  title: string;
  message: string;
};
