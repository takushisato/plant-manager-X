import { create } from "zustand";
import { Mail, MailTable } from "@/types/mail";

type MailStore = {
  mail: Mail | null;
  setMail: (mail: Mail) => void;
  allMailList: Mail[];
  allMailTableList: MailTable[];
  getMails: () => void;
  getMailTableList: () => void;
};

export const useMailStore = create<MailStore>((set) => ({
  mail: null,
  setMail: (mail: Mail) => set({ mail }),
  allMailList: [] as Mail[],
  allMailTableList: [] as MailTable[],

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
}));
