import Layout from "@/layouts/Layout";
import AttendanceCalendar from "@/components/attendance/Calendar";
import { Box, Radio, RadioGroup, Stack, Text, Heading, Divider } from "@chakra-ui/react";
import { useState } from "react";
import { VACATION_MODE, ATTENDANCE_MODE, START_ATTENDANCE_MODE, END_ATTENDANCE_MODE } from "@/utils/consts";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { useVacation } from "@/hooks/useVacation";
import { useToast } from "@chakra-ui/react";
import { AttendanceData } from "@/types/attendance";

const AttendanceByUserId = () => {
  const [mode, setMode] = useState<typeof VACATION_MODE | typeof ATTENDANCE_MODE>(VACATION_MODE);
  const [attendanceType, setAttendanceType] = useState<typeof START_ATTENDANCE_MODE | typeof END_ATTENDANCE_MODE>(
    START_ATTENDANCE_MODE
  );

  const { postAttendance, overtimeHours, currentYearMonth } = useAttendanceStore();
  const { postVacation, getVacationDays } = useVacation();
  const toast = useToast();
  const vacationDays = getVacationDays();

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    if (mode === ATTENDANCE_MODE) {
      const data =
        attendanceType === START_ATTENDANCE_MODE
          ? {
              user_id: 1,
              date: formattedDate,
              start_time: currentTime,
              end_time: "",
            }
          : {
              user_id: 1,
              date: formattedDate,
              start_time: "",
              end_time: currentTime,
            };
      postAttendance(data);
      toast({
        title: `${attendanceType === START_ATTENDANCE_MODE ? "出勤" : "退勤"}を登録しました`,
        status: "success",
        duration: 2000,
      });
    } else {
      postVacation(formattedDate, "09:00", "18:00");
      toast({
        title: "有給申請しました",
        status: "success",
        duration: 2000,
      });
    }
  };

  // TODO 出勤簿カレンダーのデータをAPIから取得する
  const attendanceData: AttendanceData[] = [
    { date: "2025-05-17", start_time: "09:00", end_time: "18:00" },
    { date: "2025-05-18", start_time: "10:00", end_time: "19:00" },
  ];

  return (
    <Layout>
      <Box maxW="1000px" mx="auto" mt={10}>
        <Heading size="md" mb={4}>
          入力モードの選択
        </Heading>
        <RadioGroup value={mode} onChange={(value) => setMode(value as typeof mode)} mb={4}>
          <Stack direction="row" spacing={6}>
            <Radio value="attendance">出勤簿入力</Radio>
            <Radio value="vacation">有給申請</Radio>
          </Stack>
        </RadioGroup>

        {mode === "attendance" && (
          <Box mb={6}>
            <Text fontSize="sm" mb={2}>
              出勤 / 退勤を選択
            </Text>
            <RadioGroup value={attendanceType} onChange={(val) => setAttendanceType(val as "start" | "end")}>
              <Stack direction="row" spacing={6}>
                <Radio value="start">出勤</Radio>
                <Radio value="end">退勤</Radio>
              </Stack>
            </RadioGroup>
          </Box>
        )}

        <Text fontSize="sm" mb={8} color="gray.600">
          {mode === "attendance" ? "出勤簿を入力" : "有給を申請"}
          する日付を選択してください。
        </Text>

        <Box mb={8} p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
          {mode === "attendance" ? (
            <Text>
              {currentYearMonth} の残業時間: <strong>{overtimeHours} 時間</strong>
            </Text>
          ) : (
            <Text>
              有給残り: <strong>{vacationDays} 日</strong>
            </Text>
          )}
        </Box>

        <Divider mb={8} />

        <Box w="100%" maxW="1000px" mx="auto" mb={16}>
          <AttendanceCalendar label="出勤簿カレンダー" onDateClick={handleDateClick} attendanceData={attendanceData} />
        </Box>
      </Box>
    </Layout>
  );
};

export default AttendanceByUserId;
