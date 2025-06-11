import { create } from "zustand";
// import { MailGroupList } from "@/types/mail";
import { User } from "@/types/user";
// import { mockMailGroupList } from "@/fixtures/mail-group-list";
import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import { MailGroup } from "@/types/mail";

type MailGroupStore = {
  mailGroupList: MailGroup[];
  setMailGroupList: (mailGroupList: MailGroup[]) => void;
  getMailGroupList: () => void;
  createMailGroup: (selectedUsers: User[]) => void;
  groupTitle: string;
  setGroupTitle: (groupTitle: string) => void;
  groupNote: string;
  setGroupNote: (groupNote: string) => void;
};

export const useMailGroupStore = create<MailGroupStore>((set, get) => ({
  mailGroupList: [] as MailGroup[],
  setMailGroupList: (mailGroupList: MailGroup[]) => set({ mailGroupList }),
  groupTitle: "",
  setGroupTitle: (groupTitle: string) => set({ groupTitle }),
  groupNote: "",
  setGroupNote: (groupNote: string) => set({ groupNote }),

  /**
   * メールグループ一覧を取得する
   */
  getMailGroupList: async (): Promise<void> => {
    const response = await apiClient<MailGroup[]>({
      url: endpoints.get.mailGroupList,
      method: "GET",
    });
    console.log(response);
    set({ mailGroupList: response });
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
