import { create } from "zustand";
import { Mail, MailTable, MailGroupList } from "@/types/mail";

type MailStore = {
  mail: Mail | null;
  setMail: (mail: Mail) => void;
  allMailList: Mail[];
  allMailTableList: MailTable[];
  getMails: () => void;
  getMailTableList: () => void;
  sendMail: (mail: Mail) => void;
  mailGroupList: MailGroupList[];
  selectedMailGroup: MailGroupList | null;
  setMailGroupList: (mailGroupList: MailGroupList[]) => void;
  setSelectedMailGroup: (selectedMailGroup: MailGroupList | null) => void;
  getMailGroupList: () => void;
};

export const useMailStore = create<MailStore>((set) => ({
  mail: null,
  setMail: (mail: Mail) => set({ mail }),
  allMailList: [] as Mail[],
  allMailTableList: [] as MailTable[],
  mailGroupList: [],
  selectedMailGroup: null,
  setMailGroupList: (mailGroupList: MailGroupList[]) => set({ mailGroupList }),
  setSelectedMailGroup: (selectedMailGroup: MailGroupList | null) =>
    set({ selectedMailGroup }),

  /*
   * メール一覧を取得する
   * TODO バックエンドから取得する
   */
  getMails: () => {
    const mockMailList: Mail[] = [
      {
        created_at: "2021-01-01 10:00:00",
        posted_member: "山田太郎、山田花子、鈴木一郎",
        title: "テストメール1",
        message: "こんにちは1",
      },
      {
        created_at: "2021-01-01 11:00:00",
        posted_member: "山田太郎、山田花子、鈴木一郎",
        title: "テストメール2",
        message: "こんにちは2",
      },
      {
        created_at: "2021-01-01 11:00:00",
        posted_member: "山田太郎、山田花子、鈴木一郎",
        title: "テストメール3",
        message: "こんにちは3",
      },
    ];
    set({ allMailList: mockMailList });
  },

  /*
   * メール一覧から詳細情報を取得する
   */
  getMailTableList: () => {
    const mockMailTableList: MailTable[] = useMailStore
      .getState()
      .allMailList.map((mail) => ({
        created_at: mail.created_at,
        posted_member: mail.posted_member,
        title: mail.title,
      }));
    set({ allMailTableList: mockMailTableList });
  },

  /*
   * メールグループ一覧を取得する
   */
  getMailGroupList: () => {
    const mockMailGroupList: MailGroupList[] = [
      {
        id: 1,
        group_title: "テストグループ1",
        note: "テストグループ1の説明",
        records: [
          {
            recipient_user: 1,
            recipient_user_name: "山田太郎",
          },
          {
            recipient_user: 2,
            recipient_user_name: "山田花子",
          },
        ],
      },
      {
        id: 2,
        group_title: "テストグループ2",
        note: "テストグループ2の説明",
        records: [
          {
            recipient_user: 1,
            recipient_user_name: "山田太郎",
          },
        ],
      },
    ];
    set({ mailGroupList: mockMailGroupList });
    console.log(mockMailGroupList);
  },

  /*
   * メールを送信する
   * TODO APIと連携する
   */
  sendMail: (mail_detail: Mail) => {
    const mail = {
      group_id: 1,
      title: mail_detail.title,
      message: mail_detail.message,
    };
    console.log(mail);
  },
}));
