import { create } from "zustand";
import { Mail, MailTable, PostMail } from "@/types/mail";

type MailStore = {
  postMail: PostMail | null;
  setPostMail: (postMail: PostMail) => void;
  allMailList: Mail[];
  allMailTableList: MailTable[];
  getMails: () => void;
  getMailTableList: () => void;
  sendMail: (mailGroupId: number) => void;
};

export const useMailStore = create<MailStore>((set) => ({
  postMail: { title: "", message: "", group_id: 0 },
  setPostMail: (postMail: PostMail) => set({ postMail }),
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

  /*
   * メールを送信する
   * TODO APIと連携する
   */
  sendMail: (mailGroupId: number) => {
    const postMail = useMailStore.getState().postMail;

    if (!mailGroupId || !postMail?.title || !postMail?.message) {
      console.error("Missing required fields for mail");
      return;
    }

    const mail: PostMail = {
      group_id: mailGroupId,
      title: postMail.title,
      message: postMail.message,
    };
    console.log(mail);
  },
}));
