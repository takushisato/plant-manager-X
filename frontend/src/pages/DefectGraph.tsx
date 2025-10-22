import Layout from "@/layouts/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 不良カテゴリ一覧
const CATEGORIES = ["寸法不良", "切断不良", "バーリング不良", "タップ不良", "展開不良", "素材不良", "その他"] as const;

// カラーパレット
const palette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#7f7f7f"];

// 直近12か月のラベル（YYYY-MM）
function getLast12Months(): string[] {
  const now = new Date();
  const arr: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return arr;
}

const DefectGraph = () => {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    // 疑似データ生成
    const months = getLast12Months();
    const datasets = CATEGORIES.map((cat, i) => ({
      label: cat,
      data: months.map(() => Math.floor(Math.random() * 20)), // 0〜19 のランダム件数
      backgroundColor: palette[i],
      borderRadius: 4,
    }));

    setChartData({ labels: months, datasets });
  }, []);

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "不具合（直近12か月・種別別件数）" },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: "件数" },
        },
        x: { title: { display: true, text: "年月" } },
      },
    }),
    []
  );

  return (
    <Layout>
      <Box mt={4}>
        <Heading size="md" mb={4}>
          月別 不良種別（ダミーデータ）
        </Heading>

        <Box h="380px" p={4} borderWidth="1px" borderRadius="lg">
          {chartData && <Bar data={chartData} options={options} />}
        </Box>
      </Box>
    </Layout>
  );
};

export default DefectGraph;
