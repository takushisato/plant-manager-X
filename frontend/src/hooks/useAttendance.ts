import { useState } from "react";

type Attendance = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
};

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  /**
   * 出勤簿の新規入力
   * @param date
   * @param start_time
   * @param end_time
   */
  const postAttendance = async (
    date: string,
    start_time: string,
    end_time: string
  ) => {
    // TODO: APIで勤怠をPOSTする
    alert("出勤簿入力処理: " + date + " " + start_time + " " + end_time);
  };

  return { attendance, postAttendance };
};
