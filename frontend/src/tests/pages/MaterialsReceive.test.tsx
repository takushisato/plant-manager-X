import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MaterialsReceive from "@/pages/MaterialsReceive";

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
    renderWithRouter(<MaterialsReceive />);
  });

  it("テーブルヘッダーが表示される", () => {
    expect(screen.getByText("資材名")).toBeInTheDocument();
    expect(screen.getByText("在庫数")).toBeInTheDocument();
    expect(screen.getByText("価格")).toBeInTheDocument();
    expect(screen.getByText("発注在庫数")).toBeInTheDocument();
    expect(screen.getByText("受け入れ")).toBeInTheDocument();
  });

  it("資材データが表示される", () => {
    expect(screen.getByText("資材1").closest("tr")).toHaveTextContent("100");
    expect(screen.getByText("資材2").closest("tr")).toHaveTextContent("110");
    expect(screen.getByText("資材3").closest("tr")).toHaveTextContent("120");
    expect(screen.getByText("資材4").closest("tr")).toHaveTextContent("130");
    expect(screen.getByText("資材5").closest("tr")).toHaveTextContent("140");
  });
});
