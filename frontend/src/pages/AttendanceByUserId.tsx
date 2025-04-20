import Layout from "@/layouts/Layout";
import AttendanceCalendar from "@/components/attendance/Calendar";
import { Box, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import { VACATION_MODE, ATTENDANCE_MODE } from "@/utils/consts";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { useVacation } from "@/hooks/useVacation";

const AttendanceByUserId = () => {
  const [mode, setMode] = useState<
    typeof ATTENDANCE_MODE | typeof VACATION_MODE
  >("attendance");
  const { postAttendance } = useAttendanceStore();
  const { postVacation } = useVacation();

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (mode === ATTENDANCE_MODE) {
      postAttendance({
        user_id: 1, // TODO: ユーザーIDを動的に取得
        date: formattedDate,
        start_time: "09:00",
        end_time: "18:00",
      });
    } else {
      postVacation(formattedDate, "09:00", "18:00");
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
              e.target.value as typeof ATTENDANCE_MODE | typeof VACATION_MODE
            )
          }
        >
          <option value={ATTENDANCE_MODE}>出勤簿入力</option>
          <option value={VACATION_MODE}>有給申請</option>
        </Select>
        <Text mb={4}>
          {mode === ATTENDANCE_MODE ? "出勤簿を入力" : "有給を申請"}
          する日付を選択してください
        </Text>
        <AttendanceCalendar
          label="出勤簿カレンダー"
          onDateClick={handleDateClick}
        />
      </Box>
    </Layout>
  );
};

export default AttendanceByUserId;
