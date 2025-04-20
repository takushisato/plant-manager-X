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
    <Box
      maxW="350px"
      mx="auto"
      mt={4}
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
    >
      <Text>{label}</Text>
      <Calendar
        onClickDay={handleClick}
        value={value}
        locale="ja-JP"
        calendarType="gregory"
      />
    </Box>
  );
};

export default AttendanceCalendar;
