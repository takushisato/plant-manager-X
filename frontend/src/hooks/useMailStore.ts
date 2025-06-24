import { create } from "zustand";
import { Mail, MailTable, PostMail } from "@/types/mail";
import { MailGroup } from "@/types/mail";
import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";

type MailStore = {
  postMail: PostMail | null;
  setPostMail: (postMail: PostMail) => void;
  allMailList: Mail[];
  allMailTableList: MailTable[];
  getMailTableList: () => void;
  sendMail: (mailGroupId: number) => void;
  mailGroupList: MailGroup[];
  setMailGroupList: (mailGroupList: MailGroup[]) => void;
  getMailGroupList: () => void;
  createMailGroup: (selectedUserIds: number[]) => void;
  groupTitle: string;
  setGroupTitle: (groupTitle: string) => void;
  groupNote: string;
  setGroupNote: (groupNote: string) => void;
};

export const useMailStore = create<MailStore>((set, get) => ({
  postMail: { title: "", message: "", mail_group_id: 0 },
  setPostMail: (postMail: PostMail) => set({ postMail }),
  allMailList: [] as Mail[],
  allMailTableList: [] as MailTable[],
  mailGroupList: [] as MailGroup[],
  setMailGroupList: (mailGroupList: MailGroup[]) => set({ mailGroupList }),
  groupTitle: "",
  setGroupTitle: (groupTitle: string) => set({ groupTitle }),
  groupNote: "",
  setGroupNote: (groupNote: string) => set({ groupNote }),

  /**
   * メール一覧から詳細情報を取得する
   */
  getMailTableList: () => {
    const mockMailTableList: MailTable[] = useMailStore.getState().allMailList.map((mail) => ({
      created_at: mail.created_at,
      posted_member: mail.posted_member,
      title: mail.title,
    }));
    set({ allMailTableList: mockMailTableList });
  },

  /**
   * メールを送信する
   * @param mailGroupId メールグループID
   */
  sendMail: async (mailGroupId: number) => {
    const postMail = useMailStore.getState().postMail;

    if (!mailGroupId || !postMail?.title || !postMail?.message) {
      console.error("Missing required fields for mail");
      return;
    }

    const mail: PostMail = {
      mail_group_id: mailGroupId,
      title: postMail.title,
      message: postMail.message,
    };
    const response = await apiClient<Mail>({
      url: endpoints.post.mailGroupSend,
      method: "POST",
      data: mail,
    });
    set({ allMailList: [...get().allMailList, response] });
  },

  /**
   * メールグループ一覧とグループごとの送信履歴を取得する
   */
  getMailGroupList: async (): Promise<void> => {
    const response = await apiClient<MailGroup[]>({
      url: endpoints.get.mailGroupList,
      method: "GET",
    });
    set({ mailGroupList: response });
  },

  /**
   * メールグループを作成する
   * @param selectedUserIds 選択されたユーザーIDの配列
   */
  createMailGroup: async (selectedUserIds: number[]) => {
    const { groupTitle, groupNote } = get();
    const postData = {
      group_title: groupTitle,
      note: groupNote,
      records: selectedUserIds.map((userId) => ({
        recipient_user: userId,
      })),
    };
    const response = await apiClient<MailGroup>({
      url: endpoints.post.mailGroup,
      method: "POST",
      data: postData,
    });
    set({ mailGroupList: [...get().mailGroupList, response] });
  },
}));
