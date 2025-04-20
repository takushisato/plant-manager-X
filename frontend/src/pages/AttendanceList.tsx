import { useState } from "react";
import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Column } from "@/domain/common/generic-table";

type UserAttendanceList = {
  id: number;
  name: string;
  attendance_count: number;
  vacation_count: number;
  detail: string | undefined;
};

const AttendanceList = () => {
  const columns: Column<UserAttendanceList>[] = [
    { header: "従業員名", accessor: "name" },
    { header: "今月の出勤数", accessor: "attendance_count" },
    { header: "有給残り日数", accessor: "vacation_count" },
    { header: "詳細", accessor: "detail" },
  ];

  const data: UserAttendanceList[] = [
    {
      id: 1,
      name: "山田太郎",
      attendance_count: 10,
      vacation_count: 10,
      detail: "",
    },
    {
      id: 2,
      name: "鈴木次郎",
      attendance_count: 10,
      vacation_count: 10,
      detail: "",
    },
    {
      id: 3,
      name: "佐藤三郎",
      attendance_count: 10,
      vacation_count: 10,
      detail: "",
    },
  ];

  // 現在の月を管理
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // 表示用の年月文字列を作成
  const currentYearMonth = `${currentDate.getFullYear()}年${
    currentDate.getMonth() + 1
  }月`;

  // 1ヶ月前に移動
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // 1ヶ月後に移動
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

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
        <GenericTable columns={columns} data={data} />
      </Box>
    </Layout>
  );
};

export default AttendanceList;
