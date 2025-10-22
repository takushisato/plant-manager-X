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

// 不良カテゴリ
const CATEGORIES = ["寸法不良", "切断不良", "バーリング不良", "タップ不良", "展開不良", "素材不良", "その他"] as const;

// カラーパレット
const palette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#7f7f7f"];

// === 週粒度ユーティリティ（JST前提でローカル日付を利用） ===

// 週の開始日を月曜始まりで返す（時刻は 00:00）
function startOfWeekMonday(d: Date): Date {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = dt.getDay(); // 0:日〜6:土
  const diff = (day + 6) % 7; // 月曜=0 にするためのオフセット
  dt.setDate(dt.getDate() - diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

// 直近3か月の範囲で、週の開始日を配列で返す（昇順）
// 例: ["2025-08-04", "2025-08-11", ..., "2025-10-20"]
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

    // 終了日（6日後）を計算
    const endDate = new Date(d);
    endDate.setDate(endDate.getDate() + 6);
    // const ey = endDate.getFullYear();
    const em = String(endDate.getMonth() + 1).padStart(2, "0");
    const eday = String(endDate.getDate()).padStart(2, "0");

    labels.push(`${y}-${m}-${day} 〜 ${em}-${eday}`);
  }
  return labels;
}

const DefectGraph = () => {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    // 直近3か月の週開始日をラベルに
    const weeks = getWeekStartsForLast3Months();

    // 各カテゴリ×各週にランダム値
    const datasets = CATEGORIES.map((cat, i) => ({
      label: cat,
      data: weeks.map(() => Math.floor(Math.random() * 15)), // 0〜14のランダム
      backgroundColor: palette[i],
      borderRadius: 4,
    }));

    setChartData({ labels: weeks, datasets });
  }, []);

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "不良（直近3か月・週別・カテゴリ別）" },
        tooltip: {
          callbacks: {
            title(items) {
              // 週開始日を表示（必要なら「〜 +6日」表記にしてもOK）
              return items[0]?.label ?? "";
            },
            label(ctx) {
              const v = ctx.parsed.y ?? 0;
              return `${ctx.dataset.label}: ${v} 件`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "週（開始日）" },
          ticks: { maxRotation: 0, autoSkip: true }, // ラベル詰まり対策
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

  return (
    <Layout>
      <Box mt={4}>
        <Heading size="md" mb={4}>
          週別 不良種別（直近3か月・ダミーデータ）
        </Heading>

        <Box h="420px" p={4} borderWidth="1px" borderRadius="lg">
          {chartData && <Bar data={chartData} options={options} />}
        </Box>
      </Box>
    </Layout>
  );
};

export default DefectGraph;
