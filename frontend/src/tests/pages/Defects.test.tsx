import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DefectList from "@/pages/DefectList";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

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

describe("Materials Page", () => {
  beforeEach(() => {
    renderWithRouter(<DefectList />);
  });

  it("テーブルヘッダーが表示される", () => {
    expect(screen.getByText("作成者")).toBeInTheDocument();
    expect(screen.getByText("注文番号")).toBeInTheDocument();
    expect(screen.getByText("発生日時")).toBeInTheDocument();
    expect(screen.getByText("タイトル")).toBeInTheDocument();
    expect(screen.getAllByText("詳細").length).toBeGreaterThanOrEqual(1);
  });

  it("不具合データが表示される", () => {
    expect(screen.getByText("作成者1").closest("tr")).toHaveTextContent(
      "注文番号1"
    );
    expect(screen.getByText("作成者2").closest("tr")).toHaveTextContent(
      "注文番号2"
    );
  });

  it("不具合一覧のヘッダーが表示される", () => {
    expect(screen.getAllByText("発生日時")[0]).toBeInTheDocument();
    expect(screen.getAllByText("タイトル")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "詳細" })).toHaveLength(3);
  });
});
