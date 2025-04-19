import Layout from "@/layouts/Layout";
import AttendanceCalendar from "@/attendance/Calendar";
import { Box } from "@chakra-ui/react";

const AttendanceByUserId = () => {
  return (
    <Layout>
      <Box maxW="1200px" mx="auto">
        <AttendanceCalendar label="出勤簿" onDateClick={() => {}} />
      </Box>
    </Layout>
  );
};

export default AttendanceByUserId;
