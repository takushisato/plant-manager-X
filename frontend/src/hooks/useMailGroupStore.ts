import { create } from "zustand";
import { MailGroupList } from "@/types/mail-group";

type MailGroupStore = {
  mailGroupList: MailGroupList[];
  setMailGroupList: (mailGroupList: MailGroupList[]) => void;
  getMailGroupList: () => void;
  selectedMailGroup: MailGroupList | null;
  setSelectedMailGroup: (selectedMailGroup: MailGroupList | null) => void;
};

export const useMailGroupStore = create<MailGroupStore>((set) => ({
  mailGroupList: [],
  selectedMailGroup: null,
  setMailGroupList: (mailGroupList: MailGroupList[]) => set({ mailGroupList }),
  setSelectedMailGroup: (selectedMailGroup: MailGroupList | null) =>
    set({ selectedMailGroup }),

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
}));
