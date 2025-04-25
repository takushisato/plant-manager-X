import { User } from "./user";

export type Mail = {
  created_at: string;
  posted_member: string;
  title: string;
  message: string;
};

export type MailTable = {
  created_at: string;
  posted_member: string;
  title: string;
};

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

export type PostMail = {
  group_id: number;
  title: string;
  message: string;
};
