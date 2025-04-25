import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import MailList from "@/pages/MailList";
import { useMailStore } from "@/hooks/useMailStore";
import { Mail, MailTable } from "@/types/mail";

const mockMailList: Mail[] = [
  {
    created_at: "2024-04-25 10:00",
    posted_member: "山田太郎",
    title: "サンプルタイトル",
    message: "これはテストメッセージです",
  },
];

const mockMailTableList: MailTable[] = [
  {
    created_at: "2024-04-25 10:00",
    posted_member: "山田太郎",
    title: "サンプルタイトル",
  },
];

jest.mock("@/hooks/useMailStore", () => ({
  useMailStore: jest.fn(),
}));

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

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>
  );
};

describe("MailList", () => {
  beforeEach(() => {
    (useMailStore as unknown as jest.Mock).mockReturnValue({
      allMailList: mockMailList,
      allMailTableList: mockMailTableList,
      getMails: jest.fn(),
      getMailTableList: jest.fn(),
    });
  });

  it("テーブルが表示される", async () => {
    renderWithProviders(<MailList />);
    expect(await screen.findByText("サンプルタイトル")).toBeInTheDocument();
    expect(screen.getByText("山田太郎")).toBeInTheDocument();
  });

  it("行クリックでモーダルが開き、詳細が表示される", async () => {
    renderWithProviders(<MailList />);

    const row = await screen.findByText("サンプルタイトル");
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByText("メール詳細")).toBeInTheDocument();
      expect(screen.getByText("送信日時")).toBeInTheDocument();
      expect(
        screen.getByText("これはテストメッセージです")
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: "閉じる" });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("メール詳細")).not.toBeInTheDocument();
    });
  });
});
