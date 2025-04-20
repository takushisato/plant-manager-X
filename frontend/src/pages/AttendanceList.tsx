import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Column } from "@/domain/common/generic-table";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { useEffect } from "react";
import { UserAttendanceList } from "@/types/attendance";


const AttendanceList = () => {
  const columns: Column<UserAttendanceList>[] = [
    { header: "従業員名", accessor: "name" },
    { header: "今月の出勤数", accessor: "attendance_count" },
    { header: "詳細", accessor: "detail" },
  ];
  const {
    currentYearMonth,
    handlePrevMonth,
    handleNextMonth,
    allUserAttendanceList,
    getUserAttendanceList,
  } = useAttendanceStore();

  useEffect(() => {
    getUserAttendanceList();
  }, [getUserAttendanceList]);

  return (
    <Layout>
      <Box mt={4}>
        <Flex
          alignItems="center"
          gap={2}
          maxW="1200px"
          mx="auto"
          fontSize="24px"
          mb={4}
        >
          <Button onClick={handlePrevMonth}>←</Button>
          <h1>{currentYearMonth}</h1>
          <Button onClick={handleNextMonth}>→</Button>
        </Flex>
        <GenericTable columns={columns} data={allUserAttendanceList} />
      </Box>
    </Layout>
  );
};

export default AttendanceList;
