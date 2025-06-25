import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import MailCreate from "@/pages/MailCreate";
import { useMailStore } from "@/hooks/useMailStore";
import { MailGroupList } from "@/types/mail";

const mockMailGroupList: MailGroupList[] = [
  {
    id: 1,
    group_title: "開発チーム",
    note: "開発メンバー全員",
    recipient_users: [
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
];

jest.mock("@/hooks/useAuthStore", () => ({
  __esModule: true,
  useAuthStore: jest.fn(() => ({
    user: {
      name: "テストユーザー",
      permission: {
        material_access: true,
        staff_hub_access: false,
        can_manage_own_attendance: false,
        can_manage_all_attendance: false,
        can_view_production_plan: false,
        can_edit_production_plan: false,
        can_view_order: false,
        can_edit_order: false,
        can_view_defect: false,
        can_edit_defect: false,
      },
    },
    allUsers: [
      { id: 1, name: "山田太郎" },
      { id: 2, name: "山田花子" },
    ],
    getAllUsers: jest.fn(),
    logout: jest.fn(),
    restoreSession: jest.fn(),
  })),
}));

jest.mock("@/hooks/useMailStore", () => ({
  useMailStore: jest.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>
  );
};

describe("MailCreate", () => {
  const sendMailMock = jest.fn();
  const createMailGroupMock = jest.fn();

  beforeEach(() => {
    (useMailStore as unknown as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
      postMail: { title: "", message: "", mail_group_id: 1 },
      setPostMail: jest.fn(),
      mailGroupList: mockMailGroupList,
      getMailGroupList: jest.fn(),
      createMailGroup: createMailGroupMock,
      groupTitle: "",
      setGroupTitle: jest.fn(),
      groupNote: "",
      setGroupNote: jest.fn(),
    });
  });

  it("グループ一覧が表示される", async () => {
    renderWithProviders(<MailCreate />);
    expect(await screen.findByText("開発チーム")).toBeInTheDocument();
    expect(screen.getByText("開発メンバー全員")).toBeInTheDocument();
  });

  it("新規グループ作成モーダルでユーザー一覧が表示される", async () => {
    renderWithProviders(<MailCreate />);

    // 新規にグループを作成ボタンをクリック
    const createButton = screen.getByText("新規にグループを作成");
    fireEvent.click(createButton);

    // モーダルが開いてユーザー一覧が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("新規メールグループ作成")).toBeInTheDocument();
      expect(screen.getByText("山田太郎")).toBeInTheDocument();
      expect(screen.getByText("山田花子")).toBeInTheDocument();
    });
  });
});
