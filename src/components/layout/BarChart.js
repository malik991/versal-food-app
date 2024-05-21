"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "../../components/MyHooks/CustomeTooltip";
const salesData = [
  {
    month: "Jan",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Feb",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Mar",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Apr",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "May",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Jun",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Jul",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Aug",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Sep",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Oct",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Nov",
    total: Math.floor(Math.random() * 1000),
  },
  {
    month: "Dec",
    total: Math.floor(Math.random() * 1000),
  },
];
export default function BarGraph({ userIcon: Icon }) {
  return (
    <div
      className="bg-slate-500 shadow flex w-full flex-col gap-3 rounded-[5px]
    p-5 text-slate-100 "
    >
      <section className="flex justify-between gap-2 text-slate-100 pb-2">
        <p>Sales Data</p>
        <Icon className="w-5 h-5" />
      </section>
      <ResponsiveContainer width={"100%"} height={350}>
        <BarChart
          data={salesData}
          margin={{ top: 0, left: -15, right: 0, bottom: 0 }}
        >
          <XAxis
            dataKey={"month"}
            tickLine={false}
            axisLine={true}
            stroke="#fff"
            fontSize={13}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis
            dataKey={"total"}
            tickLine={false}
            axisLine={true}
            stroke="#fff"
            fontSize={13}
            padding={{ top: 0, bottom: 0 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            type="monotone"
            stroke="#fff"
            width={50}
            strokeWidth={3}
            dataKey={"total"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
