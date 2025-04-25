import { create } from "zustand";
import { Mail, MailTable, MailGroupList, PostMail } from "@/types/mail";
import { User } from "@/types/user";

type MailStore = {
  postMail: PostMail | null;
  setPostMail: (postMail: PostMail) => void;
  allMailList: Mail[];
  allMailTableList: MailTable[];
  getMails: () => void;
  getMailTableList: () => void;
  sendMail: () => void;
  mailGroupList: MailGroupList[];
  selectedMailGroup: MailGroupList | null;
  setMailGroupList: (mailGroupList: MailGroupList[]) => void;
  setSelectedMailGroup: (selectedMailGroup: MailGroupList | null) => void;
  getMailGroupList: () => void;
  createMailGroup: (selectedUsers: User[]) => void;
};

export const useMailStore = create<MailStore>((set) => ({
  postMail: { title: "", message: "", group_id: 0 },
  setPostMail: (postMail: PostMail) => set({ postMail }),
  allMailList: [] as Mail[],
  allMailTableList: [] as MailTable[],
  mailGroupList: [] as MailGroupList[],
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
  sendMail: () => {
    const selectedGroup = useMailStore.getState().selectedMailGroup;
    const postMail = useMailStore.getState().postMail;

    if (!selectedGroup?.id || !postMail?.title || !postMail?.message) {
      console.error("Missing required fields for mail");
      return;
    }

    /*
     * メールを送信する
     * TODO APIと連携する
     */
    const mail: PostMail = {
      group_id: selectedGroup.id,
      title: postMail.title,
      message: postMail.message,
    };
    console.log(mail);
  },

  /*
   * メールグループを作成する
   * TODO APIと連携する
   */
  createMailGroup: (selectedUsers: User[]) => {
    console.log(selectedUsers);
  },
}));
