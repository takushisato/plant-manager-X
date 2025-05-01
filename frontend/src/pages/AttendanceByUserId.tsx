import Layout from "@/layouts/Layout";
import AttendanceCalendar from "@/components/attendance/Calendar";
import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { VACATION_MODE, ATTENDANCE_MODE } from "@/utils/consts";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { useVacation } from "@/hooks/useVacation";
import { useToast } from "@chakra-ui/react";

const AttendanceByUserId = () => {
  const [mode, setMode] = useState<
    typeof ATTENDANCE_MODE | typeof VACATION_MODE
  >("attendance");
  const { postAttendance, overtimeHours, currentYearMonth } =
    useAttendanceStore();
  const { postVacation, vacation } = useVacation();
  const toast = useToast();

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (mode === ATTENDANCE_MODE) {
      postAttendance({
        user_id: 1,
        date: formattedDate,
        start_time: "09:00",
        end_time: "18:00",
      });
      toast({
        title: "出勤簿を登録しました",
        status: "success",
        duration: 2000,
      });
    } else {
      postVacation(formattedDate, "09:00", "18:00");
      toast({ title: "有給申請しました", status: "success", duration: 2000 });
    }
  };

  return (
    <Layout>
      <Box maxW="1000px" mx="auto" mt={10}>
        <Heading size="md" mb={4}>
          入力モードの選択
        </Heading>
        <RadioGroup
          value={mode}
          onChange={(value) =>
            setMode(value as typeof ATTENDANCE_MODE | typeof VACATION_MODE)
          }
          mb={4}
        >
          <Stack direction="row" spacing={6}>
            <Radio value={ATTENDANCE_MODE}>出勤簿入力</Radio>
            <Radio value={VACATION_MODE}>有給申請</Radio>
          </Stack>
        </RadioGroup>
        <Text fontSize="sm" mb={8} color="gray.600">
          {mode === ATTENDANCE_MODE ? "出勤簿を入力" : "有給を申請"}
          する日付を選択してください。
        </Text>

        <Box
          mb={8}
          p={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="gray.50"
        >
          {mode === ATTENDANCE_MODE && (
            <Text>
              {currentYearMonth} の残業時間:{" "}
              <strong>{overtimeHours} 時間</strong>
            </Text>
          )}
          {mode === VACATION_MODE && (
            <Text>
              有給残り: <strong>{vacation.length} 日</strong>
            </Text>
          )}
        </Box>

        <Divider mb={8} />

        <Box w="100%" maxW="1000px" mx="auto" mb={16}>
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
