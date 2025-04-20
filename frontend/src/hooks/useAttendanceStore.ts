import { create } from "zustand";

type NewAttendance = {
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
};

type AttendanceStore = {
  currentDate: Date;
  currentYearMonth: string;
  postAttendance: (attendance: NewAttendance) => Promise<void>;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
};

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

  /**
   * 前の月へ移動
   */
  handlePrevMonth: () => {
    const prevDate = new Date(get().currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    set({
      currentDate: prevDate,
      currentYearMonth: formatYearMonth(prevDate),
    });
  },

  /**
   * 次の月へ移動
   */
  handleNextMonth: () => {
    const nextDate = new Date(get().currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    set({
      currentDate: nextDate,
      currentYearMonth: formatYearMonth(nextDate),
    });
  },

  /**
   * 出勤簿入力処理
   * @param attendance
   */
  postAttendance: async (attendance: NewAttendance) => {
    alert(
      `出勤簿入力処理: ${attendance.date} ${attendance.start_time} ${attendance.end_time}`
    );
  },
}));
