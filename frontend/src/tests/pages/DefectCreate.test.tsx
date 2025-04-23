import { render, screen, fireEvent } from "@testing-library/react";
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

  it("フォームを入力して送信すると createDefect が呼ばれる", () => {
    fireEvent.change(screen.getByTestId("occurred_at"), {
      target: { value: "2025-04-23" },
    });
    fireEvent.change(screen.getByTestId("title"), {
      target: { value: "テストタイトル" },
    });
    fireEvent.change(screen.getByTestId("defect_detail"), {
      target: { value: "テスト詳細" },
    });
    fireEvent.change(screen.getByTestId("submission_deadline"), {
      target: { value: "2025-04-30" },
    });
    fireEvent.change(screen.getByTestId("order"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    expect(createDefectMock).toHaveBeenCalledWith({
      occurred_at: "2025-04-23",
      title: "テストタイトル",
      defect_detail: "テスト詳細",
      submission: "当事者が後日入力",
      submission_deadline: "2025-04-30",
      create_user: "",
      order: "1",
    });
  });
});
