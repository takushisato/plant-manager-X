import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import MailCreate from "@/pages/MailCreate";
import { useMailStore } from "@/hooks/useMailStore";
import { useMailGroupStore } from "@/hooks/useMailGroupStore";
import { MailGroupList } from "@/types/mail";

const mockMailGroupList: MailGroupList[] = [
  {
    id: 1,
    group_title: "開発チーム",
    note: "開発メンバー全員",
    records: [
      { recipient_user: 1, recipient_user_name: "山田太郎" },
      { recipient_user: 2, recipient_user_name: "山田花子" },
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
    logout: jest.fn(),
    restoreSession: jest.fn(),
  })),
}));

jest.mock("@/hooks/useMailStore", () => ({
  useMailStore: jest.fn(),
}));

jest.mock("@/hooks/useMailGroupStore", () => ({
  useMailGroupStore: jest.fn(),
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
      postMail: { title: "", message: "", group_id: 1 },
      setPostMail: jest.fn(),
    });

    (useMailGroupStore as unknown as jest.Mock).mockReturnValue({
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
    expect(screen.getByText("山田太郎, 山田花子")).toBeInTheDocument();
  });

  it("グループ選択でフォームが表示され、送信ボタンが押せる", async () => {
    renderWithProviders(<MailCreate />);
    const groupBox = await screen.findByText("開発チーム");
    fireEvent.click(groupBox);
    expect(
      screen.getByPlaceholderText("メールタイトルを入力")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("メール本文を入力")).toBeInTheDocument();

    const sendButton = screen.getByRole("button", { name: "送信" });
    fireEvent.click(sendButton);
    expect(sendMailMock).toHaveBeenCalledWith(1);
  });

  it("新規グループ作成モーダルが開いてユーザー選択ができる", async () => {
    renderWithProviders(<MailCreate />);
    const openModalButton = screen.getByRole("button", {
      name: "新規にグループを作成",
    });
    fireEvent.click(openModalButton);

    const checkbox = await screen.findByLabelText("山田太郎");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const createButton = screen.getByRole("button", { name: "作成" });
    fireEvent.click(createButton);
    expect(createMailGroupMock).toHaveBeenCalled();
  });
});
