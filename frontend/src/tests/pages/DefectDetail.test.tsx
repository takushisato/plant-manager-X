import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DefectDetail from "@/pages/DefectDetail";

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

const mockGetDefect = jest.fn();
const mockUpdateSubmission = jest.fn();

jest.mock("@/hooks/useDefectStore", () => ({
  __esModule: true,
  useDefectStore: () => ({
    defectItem: {
      id: 1,
      title: "テストタイトル",
      defect_detail: "不具合の詳細内容",
      submission: "旧対策内容",
      submission_deadline: "2025-05-01",
      create_user: 1,
      occurred_at: "2025-04-01",
      order: 100,
    },
    getDefect: mockGetDefect,
    updateSubmission: mockUpdateSubmission,
  }),
}));

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: "1" }),
  };
});

describe("DefectDetail", () => {
  it("初期表示で項目が表示される", () => {
    render(
      <BrowserRouter>
        <DefectDetail />
      </BrowserRouter>
    );

    expect(screen.getByText("不具合情報")).toBeInTheDocument();
    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
    expect(screen.getByText("不具合の詳細内容")).toBeInTheDocument();
    expect(screen.getByText("旧対策内容")).toBeInTheDocument();
    expect(screen.getByText("2025-04-01")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("対策内容をクリックすると入力モードになり、更新が実行される", async () => {
    render(
      <BrowserRouter>
        <DefectDetail />
      </BrowserRouter>
    );

    // 編集モードに切り替え
    fireEvent.click(screen.getByText("旧対策内容"));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "新しい対策内容" } });

    // 更新ボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "対策を申請する" }));

    await waitFor(() => {
      expect(mockUpdateSubmission).toHaveBeenCalledWith(1, "新しい対策内容");
    });
  });
});
