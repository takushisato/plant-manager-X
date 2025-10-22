import Layout from "@/layouts/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// 不良カテゴリ
const CATEGORIES = ["寸法不良", "切断不良", "バーリング不良", "タップ不良", "展開不良", "素材不良", "その他"] as const;

// カラーパレット
const palette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#7f7f7f"];

// === 週単位 ===
function startOfWeekMonday(d: Date): Date {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = dt.getDay();
  const diff = (day + 6) % 7;
  dt.setDate(dt.getDate() - diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

// 直近3か月の週の開始〜終了ラベル
function getWeekStartsForLast3Months(): string[] {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const start = startOfWeekMonday(threeMonthsAgo);
  const end = startOfWeekMonday(now);

  const labels: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const endDate = new Date(d);
    endDate.setDate(endDate.getDate() + 6);
    const em = String(endDate.getMonth() + 1).padStart(2, "0");
    const eday = String(endDate.getDate()).padStart(2, "0");

    labels.push(`${y}-${m}-${day} 〜 ${em}-${eday}`);
  }
  return labels;
}

type WeeklyDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderRadius?: number;
};

// ラベルは string[], データは number[]
type BarChartData = ChartData<"bar", number[], string>;
type DoughnutChartData = ChartData<"doughnut", number[], string>;

const DefectGraph = () => {
  // 2段に分割した週次グラフ用データ
  const [weeklySegments, setWeeklySegments] = useState<BarChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<DoughnutChartData | null>(null);

  useEffect(() => {
    const weeks = getWeekStartsForLast3Months();

    const baseDatasets: WeeklyDataset[] = CATEGORIES.map((cat, i) => ({
      label: cat,
      data: weeks.map(() => Math.floor(Math.random() * 15)),
      backgroundColor: palette[i],
      borderRadius: 4,
    }));

    const mid = Math.ceil(weeks.length / 2);

    const makeSegment = (labels: string[], startIdx: number, endIdx: number): BarChartData => ({
      labels,
      datasets: baseDatasets.map((ds) => ({
        label: ds.label,
        data: ds.data.slice(startIdx, endIdx),
        backgroundColor: ds.backgroundColor,
        borderRadius: ds.borderRadius,
      })),
    });

    const seg1 = makeSegment(weeks.slice(0, mid), 0, mid);
    const seg2 = makeSegment(weeks.slice(mid), mid, weeks.length);
    setWeeklySegments([seg1, seg2]);

    const yearlyCounts = CATEGORIES.map(() => Math.floor(Math.random() * 200 + 50));
    setYearlyData({
      // labels: CATEGORIES,
      datasets: [
        {
          label: "1年分 件数",
          data: yearlyCounts,
          backgroundColor: palette,
        },
      ],
    });
  }, []);

  const weeklyOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 20, // ← 下余白を20px確保（必要に応じて調整）
        },
      },
      plugins: {
        legend: { position: "top" },
        title: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y ?? 0} 件`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "週（開始〜終了）",
            padding: { top: 10 }, // タイトルと軸線の間の余白を追加
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            padding: 6, // ← ラベルと軸線の距離を少し離す
          },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: "件数" },
        },
      },
    }),
    []
  );

  const yearlyOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        title: { display: true, text: "不良種別（年間割合・ダミーデータ）" },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const value = ctx.parsed;
              const pct = ((value / total) * 100).toFixed(1);
              return `${ctx.label}: ${value} 件 (${pct}%)`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <Layout>
      <Box mt={4} mx="auto" maxW="1200px" px={4}>
        <Heading size="md" mb={4}>
          不良データ分析
        </Heading>

        {/* 週別棒グラフ（2段） */}
        <Heading size="md" mb={2}>
          直近3ヶ月の不良発生数（週別・カテゴリ別）
        </Heading>

        {/* 1段目（前半） */}
        <Box h="420px" p={4} borderWidth="1px" borderRadius="lg" mb={6}>
          {weeklySegments[0] && (
            <>
              <Heading size="sm" mb={2}>
                前半：{weeklySegments[0].labels?.[0]} 〜{" "}
                {weeklySegments[0].labels?.[weeklySegments[0].labels!.length - 1]}
              </Heading>
              <Bar data={weeklySegments[0]} options={weeklyOptions} />
            </>
          )}
        </Box>

        {/* 2段目（後半） */}
        <Box h="420px" p={4} borderWidth="1px" borderRadius="lg" mb={8}>
          {weeklySegments[1] && (
            <>
              <Heading size="sm" mb={2}>
                後半：{weeklySegments[1].labels?.[0]} 〜{" "}
                {weeklySegments[1].labels?.[weeklySegments[1].labels!.length - 1]}
              </Heading>
              <Bar data={weeklySegments[1]} options={weeklyOptions} />
            </>
          )}
        </Box>

        {/* 年間円グラフ */}
        <Heading size="md" mb={4}>
          1年間の不良発生数（カテゴリ別割合）
        </Heading>
        <Box h="520px" p={4} borderWidth="1px" borderRadius="lg">
          {yearlyData && <Doughnut data={yearlyData} options={yearlyOptions} />}
        </Box>
      </Box>
    </Layout>
  );
};

export default DefectGraph;
