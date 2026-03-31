"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MandiTrendPoint } from "@/lib/types";

export function MandiLineChart({
  data,
  height = 200,
}: {
  data: MandiTrendPoint[];
  height?: number;
}) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(16, 185, 129, 0.12)" strokeDasharray="3 6" />
          <XAxis dataKey="label" tick={{ fill: "rgba(20, 83, 45, 0.75)", fontSize: 12 }} />
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
            labelStyle={{ color: "#065f46", fontWeight: 800 }}
            formatter={(value: unknown) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`₹${Number.isFinite(n) ? Math.round(n) : ""}`, "Price / q"];
            }}
          />
          <Line
            type="monotone"
            dataKey="priceINRPerQuintal"
            stroke="#059669"
            strokeWidth={3}
            dot={{ r: 3, fill: "#059669", stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

