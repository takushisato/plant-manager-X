import { create } from "zustand";
import {
  AttendanceStore,
  NewAttendance,
  AttendanceListResponse,
  UpdateAttendance,
  AllUserAttendanceList,
  AttendanceData,
} from "@/types/attendance";
import { endpoints } from "@/utils/apiUrls";
import { apiClient } from "@/domain/api/apiClient";

/**
 * 年月を表示用の文字列に変換
 * @param date
 * @returns
 */
const formatYearMonth = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  currentDate: new Date(),
  currentYearMonth: formatYearMonth(new Date()),
  allUserAttendanceList: [],
  overtimeHours: 0,
  attendanceData: [],

  /**
   * ユーザーの出勤簿を取得
   */
  getAttendanceByUserId: async () => {
    const response = await apiClient<AttendanceData[]>({
      url: endpoints.get.attendanceMyList(get().currentYearMonth),
      method: "GET",
    });
    set({ attendanceData: response });
  },

  /**
   * 全ユーザーの出勤簿リストを取得
   */
  getUserAttendanceList: async () => {
    const response = await apiClient<AttendanceListResponse[]>({
      url: endpoints.get.attendanceAllList("2025-03"),
      method: "GET",
    });

    const allUserAttendanceList: AllUserAttendanceList[] = response.map((item) => ({
      id: item.user.id,
      name: item.user.name,
      attendance_count: item.total_worked_date,
      detail: item.detail,
    }));

    set({ allUserAttendanceList });
  },

  /**
   * 前の月へ移動
   */
  handlePrevMonth: () => {
    const currentDate = new Date(get().currentDate);
    currentDate.setMonth(currentDate.getMonth() - 1);
    set({ currentDate, currentYearMonth: formatYearMonth(currentDate) });
  },

  /**
   * 次の月へ移動
   */
  handleNextMonth: () => {
    const currentDate = new Date(get().currentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    set({ currentDate, currentYearMonth: formatYearMonth(currentDate) });
  },

  /**
   * 出勤簿入力処理
   * @param attendance
   */
  postAttendance: async (attendance: NewAttendance) => {
    const response = await apiClient<{ status: string }>({
      url: endpoints.post.attendanceRecords,
      method: "POST",
      data: attendance,
    });
    if (response.status === "success") {
      get().getUserAttendanceList();
    }
  },

  /**
   * 出勤簿更新処理
   * @param attendance
   */
  putAttendance: async (attendance: UpdateAttendance) => {
    const response = await apiClient<{ status: string }>({
      url: endpoints.put.attendanceRecords(attendance.id),
      method: "PUT",
      data: attendance,
    });
    if (response.status === "success") {
      get().getUserAttendanceList();
    }
  },
}));
