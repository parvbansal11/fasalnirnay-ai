"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function MandiBarChart({
  data,
  height = 200,
}: {
  data: { cropName: string; priceINRPerQuintal: number }[];
  height?: number;
}) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(16, 185, 129, 0.12)" />
          <XAxis dataKey="cropName" tick={{ fill: "rgba(20, 83, 45, 0.75)", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "rgba(20, 83, 45, 0.7)", fontSize: 12 }}
            tickFormatter={(v) => `₹${Math.round(v)}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(134, 239, 172, 0.45)",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
            formatter={(value: unknown) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`₹${Number.isFinite(n) ? Math.round(n) : ""}`, "Current avg price / q"];
            }}
          />
          <Bar dataKey="priceINRPerQuintal" fill="#059669" radius={[14, 14, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

