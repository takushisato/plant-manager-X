import Layout from "@/layouts/Layout";
import AttendanceCalendar from "@/components/attendance/Calendar";
import { Box, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { VACATION_MODE, ATTENDANCE_MODE } from "@/utils/consts";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { useVacation } from "@/hooks/useVacation";

const AttendanceByUserId = () => {
  const [mode, setMode] = useState<
    typeof ATTENDANCE_MODE | typeof VACATION_MODE
  >("attendance");
  const { postAttendance, overtimeHours, currentYearMonth } =
    useAttendanceStore();
  const { postVacation, vacation } = useVacation();

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
      <Box maxW="1000px" mx="auto" mt={6}>
        <RadioGroup
          value={mode}
          onChange={(value) =>
            setMode(value as typeof ATTENDANCE_MODE | typeof VACATION_MODE)
          }
          mb={8}
        >
          <Stack direction="row" spacing={6}>
            <Radio value={ATTENDANCE_MODE}>出勤簿入力</Radio>
            <Radio value={VACATION_MODE}>有給申請</Radio>
          </Stack>
        </RadioGroup>
        <Text mb={4}>
          {mode === ATTENDANCE_MODE ? "出勤簿を入力" : "有給を申請"}
          する日付を選択してください
        </Text>
        <Box mt={8}>
          {mode === ATTENDANCE_MODE && (
            <>
              <p>
                {currentYearMonth}の残業時間: {overtimeHours}
              </p>
            </>
          )}
          {mode === VACATION_MODE && (
            <>
              <p>有給残り: {vacation.length}</p>
            </>
          )}
        </Box>
        <Box w="100%" maxW="1000px" mx="auto">
          <AttendanceCalendar
            label="出勤簿カレンダー"
            onDateClick={handleDateClick}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default AttendanceByUserId;
