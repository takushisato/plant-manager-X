import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AttendanceList from "@/pages/AttendanceList";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { within } from "@testing-library/react";

jest.mock("@/hooks/useAttendanceStore");

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

const mockGetUserAttendanceList = jest.fn();
const mockHandlePrevMonth = jest.fn();
const mockHandleNextMonth = jest.fn();

beforeEach(() => {
  (useAttendanceStore as unknown as jest.Mock).mockReturnValue({
    currentYearMonth: "2024-04",
    handlePrevMonth: mockHandlePrevMonth,
    handleNextMonth: mockHandleNextMonth,
    allUserAttendanceList: [
      {
        id: 1,
        name: "山田太郎",
        attendance_count: 10,
        detail: "",
      },
      {
        id: 2,
        name: "鈴木次郎",
        attendance_count: 8,
        detail: "",
      },
    ],
    getUserAttendanceList: mockGetUserAttendanceList,
  });
});

describe("AttendanceList", () => {
  it("年月と前月・翌月ボタンが表示される", () => {
    render(
      <BrowserRouter>
        <AttendanceList />
      </BrowserRouter>
    );

    expect(screen.getByText("2024-04")).toBeInTheDocument();
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("ユーザーの出勤データがテーブルに表示される", () => {
    render(
      <BrowserRouter>
        <AttendanceList />
      </BrowserRouter>
    );

    expect(screen.getByText("山田太郎")).toBeInTheDocument();
    expect(screen.getByText("鈴木次郎")).toBeInTheDocument();

    const table = screen.getByRole("table");
    const links = within(table).getAllByRole("link", { name: "詳細" });
    expect(links).toHaveLength(2); // ヘッダーを除外したリンク数
  });

  it("前月・翌月ボタンが押されたとき、対応する関数が呼ばれる", () => {
    render(
      <BrowserRouter>
        <AttendanceList />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("←"));
    fireEvent.click(screen.getByText("→"));

    expect(mockHandlePrevMonth).toHaveBeenCalled();
    expect(mockHandleNextMonth).toHaveBeenCalled();
  });
});
