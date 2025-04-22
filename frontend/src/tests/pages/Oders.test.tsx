import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OrderList from "@/pages/OrderList";

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
    renderWithRouter(<OrderList />);
  });

  it("テーブルヘッダーが表示される", () => {
    expect(screen.getByText("顧客名")).toBeInTheDocument();
    expect(screen.getByText("注文番号")).toBeInTheDocument();
    expect(screen.getByText("注文日")).toBeInTheDocument();
    expect(screen.getByText("商品名")).toBeInTheDocument();
    expect(screen.getByText("数量")).toBeInTheDocument();
    expect(screen.getByText("価格")).toBeInTheDocument();
    expect(screen.getByText("納期")).toBeInTheDocument();
    expect(screen.getByText("備考")).toBeInTheDocument();
  });

  it("注文データが表示される", () => {
    expect(screen.getByText("顧客1").closest("tr")).toHaveTextContent(
      "注文番号1"
    );
    expect(screen.getByText("顧客2").closest("tr")).toHaveTextContent(
      "注文番号2"
    );
  });
});
