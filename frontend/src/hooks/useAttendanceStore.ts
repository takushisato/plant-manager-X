import { create } from "zustand";
import { AttendanceStore, NewAttendance } from "@/types/attendance";
import { mockAttendanceList } from "@/fixtures/attendance-list";

/**
 * 年月を表示用の文字列に変換
 * @param date
 * @returns
 */
const formatYearMonth = (date: Date): string => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  currentDate: new Date(),
  currentYearMonth: formatYearMonth(new Date()),
  allUserAttendanceList: [],
  overtimeHours: 0,

  /**
   * 全ユーザーの出勤簿リストを取得
   * TODO: APIから取得する様に変更する
   */
  getUserAttendanceList: async () => {
    const mockData = mockAttendanceList;
    set({ allUserAttendanceList: mockData });
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
    if (attendance.start_time) {
      // 出勤時間が存在する場合、出勤簿をPOSTする
      // TODO: APIで出勤簿をPOSTする
      alert("出勤簿処理: " + JSON.stringify(attendance));
    }
    if (attendance.end_time) {
      // 退勤時間が存在する場合、退勤簿をPOSTする
      // TODO: APIで退勤簿をPOSTする
      alert("退勤簿処理: " + JSON.stringify(attendance));
    }
  },
}));
