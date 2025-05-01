import { useState } from "react";

type Vacation = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
};

export const useVacation = () => {
  const [vacation, setVacation] = useState<Vacation[]>([]);

  /**
   * 有給の残り日数を取得する
   * @returns 有給の残り日数
   */
  const getVacationDays = () => {
    // TODO: APIで有給申請を取得する
    const vacationDays = 10;
    return vacationDays;
  };

  /**
   * 有給申請の新規入力
   * @param date
   * @param start_time
   * @param end_time
   */
  const postVacation = async (
    date: string,
    start_time: string,
    end_time: string
  ) => {
    // TODO: APIで有給申請をPOSTする
    alert("有給申請処理: " + date + " " + start_time + " " + end_time);
  };

  return { vacation, postVacation, getVacationDays };
};
