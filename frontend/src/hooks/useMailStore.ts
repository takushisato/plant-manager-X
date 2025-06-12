import { create } from "zustand";
import { Mail, MailTable, PostMail } from "@/types/mail";
import { mockMailList } from "@/fixtures/mail-list";
import { MailGroup } from "@/types/mail";
import { User } from "@/types/user";
import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";

type MailStore = {
  postMail: PostMail | null;
  setPostMail: (postMail: PostMail) => void;
  allMailList: Mail[];
  allMailTableList: MailTable[];
  getMails: () => void;
  getMailTableList: () => void;
  sendMail: (mailGroupId: number) => void;
  mailGroupList: MailGroup[];
  setMailGroupList: (mailGroupList: MailGroup[]) => void;
  getMailGroupList: () => void;
  createMailGroup: (selectedUsers: User[]) => void;
  groupTitle: string;
  setGroupTitle: (groupTitle: string) => void;
  groupNote: string;
  setGroupNote: (groupNote: string) => void;
};

export const useMailStore = create<MailStore>((set, get) => ({
  postMail: { title: "", message: "", group_id: 0 },
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
   * メール一覧を取得する
   * TODO バックエンドから取得する
   */
  getMails: () => {
    const mailList = mockMailList;
    set({ allMailList: mailList });
  },

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
   * TODO APIと連携する
   * @param mailGroupId メールグループID
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
