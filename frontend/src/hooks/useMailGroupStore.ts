import { create } from "zustand";
import { MailGroupList } from "@/types/mail";
import { User } from "@/types/user";
import { mockMailGroupList } from "@/fixtures/mail-group-list";

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
    const mailGroupList = mockMailGroupList;
    set({ mailGroupList });
  },

  /*
   * メールグループを作成する
   * TODO APIと連携する
   */
  createMailGroup: (selectedUsers: User[]) => {
    console.log(selectedUsers);
  },
}));
