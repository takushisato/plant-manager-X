import { render, screen } from "@testing-library/react";
import Layout from "@/layouts/Layout";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("@/hooks/useAuthStore", () => ({
  useAuthStore: jest.fn(() => ({
    user: {
      name: "テストユーザー",
      permission: {
        material_access: true,
        can_manage_own_attendance: true,
        can_manage_all_attendance: true,
        can_view_production_plan: true,
        can_edit_production_plan: true,
        can_view_order: true,
        can_edit_order: true,
        can_view_defect: true,
      },
    },
    restoreSession: jest.fn(),
    logout: jest.fn(),
  })),
}));

describe("Layout", () => {
  it("Header, children, Footer が表示される", () => {
    render(
      <BrowserRouter>
        <Layout>
          <p>これはテスト用の子要素です</p>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText("工場管理くん")).toBeInTheDocument();
    expect(screen.getByText("これはテスト用の子要素です")).toBeInTheDocument();
    expect(
      screen.getByText("© 2025 工場管理くん制作委員会")
    ).toBeInTheDocument();
  });
});
