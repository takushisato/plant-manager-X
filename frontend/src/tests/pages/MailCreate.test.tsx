import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import MailCreate from "@/pages/MailCreate";
import { useMailStore } from "@/hooks/useMailStore";
import { MailGroup } from "@/types/mail";

const mockMailGroupList: MailGroup[] = [
  {
    id: 1,
    group_title: "開発チーム",
    note: "開発メンバー全員",
    recipient_users: [
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

    (useMailStore as unknown as jest.Mock).mockReturnValue({
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
});
