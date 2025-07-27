import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProductionPlanList from "@/pages/ProductionPlanList";
import { useProductionStore } from "@/hooks/useProductionStore";

jest.mock("@/hooks/useProductionStore");

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

describe("ProductionPlanList", () => {
  beforeEach(() => {
    (useProductionStore as unknown as jest.Mock).mockReturnValue({
      productionPlanList: {
        organization: { organization_name: "テスト組織" },
        records: [],
      },
      totalDays: 5,
      chartStartDate: new Date("2025-05-01"),
      getProductionPlanList: jest.fn(),
      addProductionPlanRecord: jest.fn(),
      updateProductionPlanRecord: jest.fn(),
      setTaskTitle: jest.fn(),
      setTaskStartDate: jest.fn(),
      setTaskEndDate: jest.fn(),
      setActualStartDate: jest.fn(),
      setActualEndDate: jest.fn(),
      setCurrentEditTaskId: jest.fn(),
      setChartStartDate: jest.fn(),
      setChartEndDate: jest.fn(),
      taskTitle: "",
      taskStartDate: "",
      taskEndDate: "",
      actualStartDate: "",
      actualEndDate: "",
      currentEditTaskId: null,
      moveUp: jest.fn(),
      moveDown: jest.fn(),
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter initialEntries={["/production-plan"]}>
        <Routes>
          <Route path="/production-plan" element={component} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("ヘッダーが表示される", () => {
    renderWithRouter(<ProductionPlanList />);
    expect(screen.getByText("テスト組織 生産計画ガントチャート")).toBeInTheDocument();
  });

  it("タスク追加モーダルが開く", () => {
    renderWithRouter(<ProductionPlanList />);
    fireEvent.click(screen.getByText("タスク追加"));
    expect(screen.getByText("新しいタスクを追加")).toBeInTheDocument();
  });

  it("表示期間モーダルが開く", () => {
    renderWithRouter(<ProductionPlanList />);
    const periodButton = screen.getByRole("button", { name: "表示期間を変更" });
    fireEvent.click(periodButton);
    expect(screen.getByRole("dialog")).toHaveTextContent("表示期間を変更");
  });
});
