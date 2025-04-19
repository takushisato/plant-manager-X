import Layout from "@/layouts/Layout";
import AttendanceCalendar from "@/attendance/Calendar";
import { Box, Select } from "@chakra-ui/react";
import { useState } from "react";
import { VACATION_MODE, ATTENDANCE_MODE } from "@/utils/consts";

const AttendanceByUserId = () => {
  const [mode, setMode] = useState<
    typeof VACATION_MODE | typeof ATTENDANCE_MODE
  >(ATTENDANCE_MODE);

  const handleDateClick = (date: Date) => {
    if (mode === VACATION_MODE) {
      // TODO: 有給申請用モーダルやAPI呼び出しなど
      alert("有給申請処理: " + date);
    } else if (mode === ATTENDANCE_MODE) {
      // TODO: 勤怠入力用モーダルや画面遷移など
      alert("出勤簿入力処理: " + date);
    }
  };

  return (
    <Layout>
      <Box maxW="1200px" mx="auto" mt={6}>
        <Select
          maxW="200px"
          mb={4}
          value={mode}
          onChange={(e) =>
            setMode(
              e.target.value as typeof VACATION_MODE | typeof ATTENDANCE_MODE
            )
          }
        >
          <option value="attendance">出勤簿入力</option>
          <option value="vacation">有給申請</option>
        </Select>

        <AttendanceCalendar
          label="出勤簿カレンダー"
          onDateClick={handleDateClick}
        />
      </Box>
    </Layout>
  );
};

export default AttendanceByUserId;
