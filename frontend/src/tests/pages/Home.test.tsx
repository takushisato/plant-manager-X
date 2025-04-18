import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";

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

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Home", () => {
  it("ロゴのテキストが正しく表示される", () => {
    renderWithRouter(<Home />);
    const logoTitle = screen.getByTestId("home-logo-title");
    expect(logoTitle).toBeInTheDocument();
    expect(logoTitle).toHaveTextContent("工場管理くん");
    expect(screen.getByText("プロトタイプ")).toBeInTheDocument();
  });
});
