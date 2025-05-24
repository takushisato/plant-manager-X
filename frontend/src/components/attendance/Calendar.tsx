import { useState } from "react";
import Calendar from "react-calendar";
import { Box, Text } from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css";

type Props = {
  onDateClick: (date: Date) => void;
  label: string;
};

const AttendanceCalendar = ({ onDateClick, label }: Props) => {
  const [value, setValue] = useState<Date>(new Date());

  const handleClick = (date: Date) => {
    setValue(date);
    onDateClick(date);
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
        <Calendar onClickDay={handleClick} value={value} locale="ja-JP" calendarType="gregory" />
      </Box>
    </Box>
  );
};

export default AttendanceCalendar;
