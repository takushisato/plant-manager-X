import { create } from "zustand";
import { MailGroupList } from "@/types/mail";
import { User } from "@/types/user";
import { mockMailGroupList } from "@/fixtures/mail-group-list";

type MailGroupStore = {
  mailGroupList: MailGroupList[];
  setMailGroupList: (mailGroupList: MailGroupList[]) => void;
  getMailGroupList: () => void;
  createMailGroup: (selectedUsers: User[]) => void;
  groupTitle: string;
  setGroupTitle: (groupTitle: string) => void;
  groupNote: string;
  setGroupNote: (groupNote: string) => void;
};

export const useMailGroupStore = create<MailGroupStore>((set, get) => ({
  mailGroupList: [] as MailGroupList[],
  setMailGroupList: (mailGroupList: MailGroupList[]) => set({ mailGroupList }),
  groupTitle: "",
  setGroupTitle: (groupTitle: string) => set({ groupTitle }),
  groupNote: "",
  setGroupNote: (groupNote: string) => set({ groupNote }),

  /**
   * メールグループ一覧を取得する
   */
  getMailGroupList: () => {
    const mailGroupList = mockMailGroupList;
    set({ mailGroupList });
  },

  /**
   * メールグループを作成する
   * TODO APIと連携する
   * @param selectedUsers 選択されたユーザー
   */
  createMailGroup: (selectedUsers: User[]) => {
    const { groupTitle, groupNote } = get();
    const postData = {
      group_title: groupTitle,
      note: groupNote,
      records: selectedUsers.map((user) => ({
        recipient_user: user.id,
        recipient_user_name: user.name,
      })),
    };
    console.log(postData);
  },
}));
