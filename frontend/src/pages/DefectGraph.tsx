// import Layout from "@/layouts/Layout";
// import { Box } from "@chakra-ui/react";
// import { useDefectStore } from "@/hooks/useDefectStore";
// import { useEffect } from "react";
import Layout from "@/layouts/Layout";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect, useMemo } from "react";

// Chart.js 本体と必要モジュールを登録
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

type Defect = {
  status?: string;
  created_at?: string;
  createdAt?: string;
  // 他の必要なフィールドを追加
};

const DefectGraph = () => {
  const { defectList, getDefects } = useDefectStore();

  useEffect(() => {
    // 初回取得
    getDefects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- 集計: ステータス別件数（Bar） -----------------
  const statusBarData = useMemo(() => {
    // 例: status が "open" | "in_progress" | "done" など
    const counts = new Map<string, number>();
    for (const d of defectList ?? []) {
      const s = String((d as Defect).status ?? "unknown");
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    const labels = Array.from(counts.keys());
    const data = labels.map((l) => counts.get(l) ?? 0);

    return {
      labels,
      datasets: [
        {
          label: "ステータス別 件数",
          data,
          // react-chartjs-2 では色指定は任意（なくてもOK）
          // backgroundColor: "rgba(99, 132, 255, 0.5)",
        },
      ],
    };
  }, [defectList]);

  const statusBarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const },
        title: { display: true, text: "不具合（ステータス別）" },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    }),
    []
  );

  // ---- 集計: 月次件数（Line） --------------------------
  const monthlyLineData = useMemo(() => {
    // created_at（ISO日付想定）を "YYYY-MM" に丸めてカウント
    const monthly = new Map<string, number>();
    for (const d of defectList ?? []) {
      const iso = (d as Defect).created_at ?? (d as Defect).createdAt;
      if (!iso) continue;
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) continue;
      const label = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      monthly.set(label, (monthly.get(label) ?? 0) + 1);
    }
    // ラベルを昇順に並べる
    const labels = Array.from(monthly.keys()).sort();
    const data = labels.map((l) => monthly.get(l) ?? 0);

    return {
      labels,
      datasets: [
        {
          label: "月次 件数",
          data,
          tension: 0.3,
          // borderColor: "rgba(99, 132, 255, 1)",
          // backgroundColor: "rgba(99, 132, 255, 0.2)",
        },
      ],
    };
  }, [defectList]);

  const monthlyLineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const },
        title: { display: true, text: "不具合（月次推移）" },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    }),
    []
  );

  return (
    <Layout>
      <Box mt={4}>
        <Heading size="md" mb={4}>
          グラフ
        </Heading>

        <Stack spacing={8}>
          {/* ステータス別（Bar） */}
          <Box h="320px" p={4} borderWidth="1px" borderRadius="lg">
            <Bar data={statusBarData} options={statusBarOptions} />
          </Box>

          {/* 月次推移（Line） */}
          <Box h="320px" p={4} borderWidth="1px" borderRadius="lg">
            <Line data={monthlyLineData} options={monthlyLineOptions} />
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
};

export default DefectGraph;
