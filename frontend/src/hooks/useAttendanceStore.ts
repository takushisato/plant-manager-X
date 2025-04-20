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
  allUserAttendanceList: AllUserAttendanceList[];
  getUserAttendanceList: () => Promise<void>;
};

type AllUserAttendanceList = {
  id: number;
  name: string;
  attendance_count: number;
  detail: string | undefined;
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
  allUserAttendanceList: [],

  /**
   * 全ユーザーの出勤簿リストを取得
   */
  getUserAttendanceList: async () => {
    const mockData: AllUserAttendanceList[] = [
      {
        id: 1,
        name: "山田太郎",
        attendance_count: 10,
        detail: "",
      },
      {
        id: 2,
        name: "鈴木次郎",
        attendance_count: 10,
        detail: "",
      },
      {
        id: 3,
        name: "佐藤三郎",
        attendance_count: 10,
        detail: "",
      },
    ];
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
    // TODO: APIで出勤簿をPOSTする
    alert("出勤簿処理: " + JSON.stringify(attendance));
  },
}));
