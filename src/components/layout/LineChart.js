"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "../../components/MyHooks/CustomeTooltip";
const numberofUsers = [
  {
    month: "Jan",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Feb",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Mar",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Apr",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "May",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Jun",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Jul",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Aug",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Sep",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Oct",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Nov",
    users: Math.floor(Math.random() * 100),
  },
  {
    month: "Dec",
    users: Math.floor(Math.random() * 100),
  },
];
export default function LineGraph({ userIcon: Icon }) {
  return (
    <div
      className="bg-slate-500 shadow flex w-full flex-col gap-3 rounded-[5px]
    p-5 text-slate-100 "
    >
      <section className="flex justify-between gap-2 text-slate-100 pb-2">
        <p>User Data</p>
        <Icon className="w-4 h-4" />
      </section>
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart
          data={numberofUsers}
          margin={{ top: 0, left: -15, right: 0, bottom: 0 }}
        >
          <Tooltip content={<CustomTooltip />} />
          <Line
            type={"monotone"}
            dataKey={"users"}
            stroke="#fff"
            width={50}
            strokeWidth={3}
          />
          <XAxis
            dataKey={"month"}
            tickLine={false}
            axisLine={true}
            stroke="#fff"
            fontSize={13}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis
            dataKey={"users"}
            tickLine={false}
            axisLine={true}
            stroke="#fff"
            fontSize={13}
            padding={{ top: 0, bottom: 0 }}
          />
          <CartesianGrid strokeDasharray={"2 2"} className="opacity-50" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
