import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AttendanceByUserId from "@/pages/AttendanceByUserId";

jest.mock("@/hooks/useAttendanceStore", () => ({
  __esModule: true,
  useAttendanceStore: jest.fn(() => ({
    postAttendance: jest.fn(),
    getAttendance: jest.fn(() => []),
    overtimeHours: 0,
    currentYearMonth: "2024-04",
    attendanceData: [],
    getAttendanceByUserId: jest.fn(),
  })),
}));

jest.mock("@/hooks/useVacation", () => ({
  __esModule: true,
  useVacation: jest.fn(() => ({
    postVacation: jest.fn(),
    vacation: [],
    getVacationDays: jest.fn(() => 10),
  })),
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

jest.mock("@/hooks/useNavigation", () => ({
  __esModule: true,
  useNavigation: jest.fn(() => ({
    navigateMenu: jest.fn(() => []),
  })),
}));

jest.mock("@/components/attendance/Calendar", () => ({
  __esModule: true,
  default: ({ onDateClick }: { onDateClick: (date: Date) => void }) => (
    <div data-testid="attendance-calendar">
      <button onClick={() => onDateClick(new Date("2024-04-10"))}>10</button>
    </div>
  ),
}));

describe("AttendanceByUserId", () => {
  it("セレクトボックスが表示される", () => {
    render(
      <BrowserRouter>
        <AttendanceByUserId />
      </BrowserRouter>
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByText("出勤簿入力")).toBeInTheDocument();
    expect(screen.getByText("有給申請")).toBeInTheDocument();
  });

  it("カレンダーが表示される", () => {
    render(
      <BrowserRouter>
        <AttendanceByUserId />
      </BrowserRouter>
    );

    expect(screen.getByTestId("attendance-calendar")).toBeInTheDocument();
    expect(screen.getByText("入力モードの選択")).toBeInTheDocument();
  });
});
