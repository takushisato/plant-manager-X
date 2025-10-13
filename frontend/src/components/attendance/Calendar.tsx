import { useState } from "react";
import Calendar from "react-calendar";
import { Box, Text } from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css";
import { AttendanceData } from "@/types/attendance";

type Props = {
  onDateClick: (date: Date) => void;
  label: string;
  attendanceData: AttendanceData[];
};

const AttendanceCalendar = ({ onDateClick, label, attendanceData }: Props) => {
  const [value, setValue] = useState<Date>(new Date());

  const handleClick = (date: Date) => {
    setValue(date);
    onDateClick(date);
  };

  /**
   * カレンダーの日付セルに出勤・退勤時間を表示する
   */
  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dateStr = date.toISOString().split("T")[0];
    const record = attendanceData.find((a) => a.date === dateStr);
    if (!record) return null;

    console.log(record);

    return (
      <Box fontSize="xs" mt={1}>
        {record.start_time && <Text color="green.500">出: {record.start_time}</Text>}
        {record.end_time && <Text color="red.500">退: {record.end_time}</Text>}
      </Box>
    );
  };

  return (
    <Box maxW="100%" mx="auto" mt={4} bg="white" p={4} borderRadius="md" boxShadow="md">
      <Text>{label}</Text>
      <Box
        sx={{
          ".react-calendar": {
            width: "auto",
            minHeight: "731px",
            "& button": {
              height: "120px",
              fontSize: "1.2rem",
            },
            "& .react-calendar__month-view__weekdays": {
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "16px",
              marginTop: "16px",
            },
          },
        }}
      >
        <Calendar
          onClickDay={handleClick}
          value={value}
          defaultActiveStartDate={new Date("2025-03-01")}
          locale="ja-JP"
          calendarType="gregory"
          tileContent={renderTileContent}
        />
      </Box>
    </Box>
  );
};

export default AttendanceCalendar;
