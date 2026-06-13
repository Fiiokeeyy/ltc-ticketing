import React from "react";

interface DonutChartProps {
  value: number;
  total: number;
  colorClass: string;
  label: string;
}

export default function DonutChart({
  value,
  total,
  colorClass,
  label,
}: DonutChartProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 36 36"
        >
          <path
            className="text-zinc-100"
            strokeWidth="4"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="4"
            strokeDasharray={`${percentage}, 100`}
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
      </div>
      <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </span>
    </div>
  );
}
