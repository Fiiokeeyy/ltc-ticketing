"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface StatusData {
  verified: number;
  pending_verification: number;
  pending_payment: number;
  rejected: number;
  cancelled: number;
}

interface StatusDonutChartProps {
  data: StatusData;
}

const COLORS = {
  verified: "#f97316", // Orange-500
  pending_verification: "#eab308", // Yellow-500
  pending_payment: "#71717a", // Gray-500
  rejected: "#ef4444", // Red-500
  cancelled: "#f87171", // Red-400
};

const STATUS_LABELS = {
  verified: "Terverifikasi",
  pending_verification: "Menunggu Verifikasi",
  pending_payment: "Menunggu Pembayaran",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

export default function StatusDonutChart({ data }: StatusDonutChartProps) {
  const chartData = [
    {
      name: STATUS_LABELS.verified,
      value: data.verified,
      color: COLORS.verified,
    },
    {
      name: STATUS_LABELS.pending_verification,
      value: data.pending_verification,
      color: COLORS.pending_verification,
    },
    {
      name: STATUS_LABELS.pending_payment,
      value: data.pending_payment,
      color: COLORS.pending_payment,
    },
    {
      name: STATUS_LABELS.rejected,
      value: data.rejected,
      color: COLORS.rejected,
    },
    {
      name: STATUS_LABELS.cancelled,
      value: data.cancelled,
      color: COLORS.cancelled,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-zinc-900">Status Transaksi</h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              formatter={(
                value: string,
                entry: { payload?: { value?: number } },
              ) => (
                <span className="text-sm text-zinc-700">
                  {value} ({entry.payload?.value ?? 0})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
