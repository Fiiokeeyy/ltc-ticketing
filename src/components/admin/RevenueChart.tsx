"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RevenueData {
  eventName: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  totalRevenue: number;
}

export default function RevenueChart({ data, totalRevenue }: RevenueChartProps) {
  // Use a nice gradient or colors for the bars
  const colors = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900">Total Pendapatan</h3>
        <p className="mt-1 text-3xl font-bold text-green-600">
          Rp {totalRevenue.toLocaleString("id-ID")}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Pendapatan terverifikasi per pertunjukan
        </p>
      </div>

      <div className="min-h-[300px] flex-1">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis
                dataKey="eventName"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickMargin={10}
                // Abbreviate long names for the X axis
                tickFormatter={(value) =>
                  value.length > 15 ? value.substring(0, 15) + "..." : value
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                width={80}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `Rp ${(value / 1000000).toFixed(1)}Jt`;
                  } else if (value >= 1000) {
                    return `Rp ${(value / 1000).toFixed(0)}rb`;
                  }
                  return `Rp ${value}`;
                }}
              />
              <Tooltip
                cursor={{ fill: "#f4f4f5" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pendapatan"]}
                labelStyle={{ color: "#18181b", fontWeight: "bold", marginBottom: "4px" }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50">
            <p className="text-sm text-zinc-500">Belum ada data pendapatan</p>
          </div>
        )}
      </div>
    </div>
  );
}
