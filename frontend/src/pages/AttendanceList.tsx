import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { Box } from "@chakra-ui/react";
import { Column } from "@/domain/common/generic-table";
import { useMemo } from "react";

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

  // TODO モックからAPIに変更する
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

  const AttendanceList = () => {
    // 現在の年月を取得して「2025年4月」形式に変換
    const currentYearMonth = useMemo(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      return `${year}年${month}月`;
    }, []);

    return (
      <Layout>
        <Box mt={4}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            maxW="1200px"
            mx="auto"
            fontSize="24px"
            mb={4}
          >
            <button>←</button>
            <h1>{currentYearMonth}</h1>
            <button>→</button>
          </Box>
          <GenericTable columns={columns} data={data} />
        </Box>
      </Layout>
    );
  };

  return <AttendanceList />;
};

export default AttendanceList;

