"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import { mergeWithMonthDays } from "@/components/MyHooks/DateTime";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const processData = (data) => {
  const aggregatedData = data.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const formattedDate = `${month}-${day}`;

    // Find if the date already exists in the accumulator
    const existingEntry = acc.find((item) => item.day === formattedDate);

    if (existingEntry) {
      // If it exists, add the totalPrice to the existing entry
      existingEntry.totalPrice += order.totalPrice;
    } else {
      // If it doesn't exist, create a new entry
      acc.push({ day: formattedDate, totalPrice: order.totalPrice });
    }

    return acc;
  }, []);

  return aggregatedData;
};

export default function BarGraph({ userIcon: Icon }) {
  const [salesData, setSalesData] = useState([]);
  const [loadBar, setLaodBar] = useState(true);
  useEffect(() => {
    axios
      .get("/api/barGraph", { timeout: 30000 })
      .then((res) => {
        if (res.data.success) {
          const transformedData = processData(res.data?.data);
          const mergedData = mergeWithMonthDays(transformedData);
          setSalesData(mergedData);
          setLaodBar(false);
        }
      })
      .catch((err) => {
        setLaodBar(false);
        console.log("error while get bar graph data: ", err);
      });
  }, []);
  if (loadBar) {
    return (
      <div
        className="bg-[#F13A01] shadow flex w-full flex-col gap-3 rounded-[5px]
  p-5 text-slate-100 "
      >
        <p className="text-white font-bold p-4">Data Loading..</p>
      </div>
    );
  }

  return (
    <>
      {salesData?.length > 0 && (
        <div
          className="bg-[#F13A01] shadow flex w-full flex-col gap-3 rounded-[5px]
    p-5 text-slate-100 "
        >
          <section className="flex justify-between gap-2 text-slate-100 pb-2">
            <p>Sales Data</p>
            <Icon className="w-5 h-5" />
          </section>
          <ResponsiveContainer width={"100%"} height={350}>
            <BarChart
              data={salesData}
              margin={{ top: 9, left: -10, right: 6, bottom: 0 }}
              barCategoryGap="20%"
              barGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<BarTooltip />} />
              <Legend />
              <XAxis
                dataKey={"day"}
                tickLine={false}
                axisLine={true}
                stroke="#fff"
                fontSize={13}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                dataKey={"totalPrice"}
                tickLine={false}
                axisLine={true}
                stroke="#fff"
                fontSize={13}
                padding={{ top: 0, bottom: 0 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar
                radius={[5, 5, 0, 0]}
                stroke="#fff"
                fill="#F0F3F7"
                width={50}
                strokeWidth={2}
                dataKey={`totalPrice`}
                name="Monthly Sale"
                label={{
                  position: "top",
                  fill: "#fff", // Color of the label
                  fontSize: "12px",
                  fontWeight: "bold",
                  formatter: (value) => (value > 0 ? `$${value}` : ""),
                  //dx: -5,
                  // dy: -3,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    console.log("label: ", label, " payload: ", payload[0]?.payload.totalPrice);
    return (
      <div
        className=""
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          color: "#F13A01",
          borderRadius: "9px",
        }}
      >
        <p className="label">{`Day: ${label}`}</p>
        <p className="intro">{`Total Price: $${payload[0].payload.totalPrice}`}</p>
      </div>
    );
  }

  return null;
};
