import { render, screen } from "@testing-library/react";
import DefectCreate from "@/pages/DefectCreate";
import { BrowserRouter } from "react-router-dom";

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

const createDefectMock = jest.fn();

jest.mock("@/hooks/useDefectStore", () => ({
  __esModule: true,
  useDefectStore: jest.fn(() => ({
    createDefect: createDefectMock,
  })),
}));

describe("DefectCreate", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <DefectCreate />
      </BrowserRouter>
    );
  });

  it("フォームの各項目が表示される", () => {
    expect(screen.getByText("発生日")).toBeInTheDocument();
    expect(screen.getByText("タイトル")).toBeInTheDocument();
    expect(screen.getByText("不具合詳細")).toBeInTheDocument();
    expect(screen.getByText("対策の入力期限")).toBeInTheDocument();
    expect(screen.getByText("作成者ID")).toBeInTheDocument();
    expect(screen.getByText("関連注文ID")).toBeInTheDocument();
  });
});
