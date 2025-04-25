import { create } from "zustand";
import { MailGroupList } from "@/types/mail";
import { User } from "@/types/user";

type MailGroupStore = {
  mailGroupList: MailGroupList[];
  setMailGroupList: (mailGroupList: MailGroupList[]) => void;
  getMailGroupList: () => void;
  createMailGroup: (selectedUsers: User[]) => void;
};

export const useMailGroupStore = create<MailGroupStore>((set) => ({
  mailGroupList: [] as MailGroupList[],
  setMailGroupList: (mailGroupList: MailGroupList[]) => set({ mailGroupList }),

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
   * メールグループを作成する
   * TODO APIと連携する
   */
  createMailGroup: (selectedUsers: User[]) => {
    console.log(selectedUsers);
  },
}));
