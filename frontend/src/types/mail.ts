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
  recipient_users: {
    recipient_user: number;
    recipient_user_name: string;
  }[];
};

export type MailGroup = {
  id: number;
  group_title: string;
  note: string;
  history: {
    id: number;
    sent_at: string;
    title: string;
    message: string;
  };
};

export type PostMail = {
  mail_group_id: number;
  title: string;
  message: string;
};
