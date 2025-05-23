import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Column } from "@/types/common/generic-table";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { useEffect } from "react";
import { AllUserAttendanceList } from "@/types/attendance";

const AttendanceList = () => {
  const { currentYearMonth, handlePrevMonth, handleNextMonth, allUserAttendanceList, getUserAttendanceList } =
    useAttendanceStore();

  const columns: Column<AllUserAttendanceList>[] = [
    { header: "従業員名", accessor: "name" },
    { header: "今月の出勤数", accessor: "attendance_count" },
    { header: "詳細", accessor: "detail" },
  ];

  useEffect(() => {
    getUserAttendanceList();
  }, [getUserAttendanceList]);

  return (
    <Layout>
      <Box mt={4}>
        {allUserAttendanceList.length === 0 ? (
          <Flex justifyContent="center" alignItems="center" h="100%">
            <Text>保存された出勤簿がありません</Text>
          </Flex>
        ) : (
          <>
            <Flex alignItems="center" gap={2} maxW="1200px" mx="auto" fontSize="24px" mb={4}>
              <Button onClick={handlePrevMonth}>←</Button>
              <h1>{currentYearMonth}</h1>
              <Button onClick={handleNextMonth}>→</Button>
            </Flex>
            <GenericTable columns={columns} data={allUserAttendanceList} />
          </>
        )}
      </Box>
    </Layout>
  );
};

export default AttendanceList;
