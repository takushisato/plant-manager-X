import { MailGroupList } from "@/types/mail";

export const mockMailGroupList: MailGroupList[] = [
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
