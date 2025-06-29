import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DefectList from "@/pages/DefectList";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

jest.mock("@/domain/api/apiClient", () => ({
  __esModule: true,
  apiClient: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        created_by: "作成者1",
        order: "注文番号1",
        occurred_at: "2025-06-01T10:00:00Z",
        title: "不具合1",
        detail: "詳細1",
      },
      {
        id: 2,
        created_by: "作成者2",
        order: "注文番号2",
        occurred_at: "2025-06-02T11:00:00Z",
        title: "不具合2",
        detail: "詳細2",
      },
      {
        id: 3,
        created_by: "作成者3",
        order: "注文番号3",
        occurred_at: "2025-06-03T12:00:00Z",
        title: "不具合3",
        detail: "詳細3",
      },
    ])
  ),
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

  it("不具合一覧のヘッダーが表示される", () => {
    expect(screen.getAllByText("発生日時")[0]).toBeInTheDocument();
    expect(screen.getAllByText("タイトル")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "詳細" })).toHaveLength(3);
  });

  it("全ての不具合タイトルが表示される", () => {
    expect(screen.getByText("不具合1")).toBeInTheDocument();
    expect(screen.getByText("不具合2")).toBeInTheDocument();
    expect(screen.getByText("不具合3")).toBeInTheDocument();
  });

  it("詳細リンクが正しく表示されている", () => {
    const detailLinks = screen.getAllByRole("link", { name: "詳細" });
    expect(detailLinks.length).toBe(3);
    detailLinks.forEach((link) => {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href");
    });
  });

  it("発生日時が全て表示される", () => {
    expect(screen.getByText("2025-06-01T10:00:00Z")).toBeInTheDocument();
    expect(screen.getByText("2025-06-02T11:00:00Z")).toBeInTheDocument();
    expect(screen.getByText("2025-06-03T12:00:00Z")).toBeInTheDocument();
  });
});

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

  it("不具合一覧のヘッダーが表示される", () => {
    expect(screen.getAllByText("発生日時")[0]).toBeInTheDocument();
    expect(screen.getAllByText("タイトル")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "詳細" })).toHaveLength(3);
  });
});
