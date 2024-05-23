"use client";

import axios from "axios";
import axiosRetry from "axios-retry";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { redirect } from "next/navigation";
import DashboardCard from "../../components/layout/DashboardCard";
import LineGraph from "../../components/layout/LineChart";
import BarGraph from "../../components/layout/BarChart";
import {
  LucideDollarSign,
  PersonStandingIcon,
  CreditCardIcon,
  CircleCheckBig,
  User2Icon,
  CandlestickChart,
} from "lucide-react";

// Configure axios-retry
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default function DashboardPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  const [conciseDataforDivs, setConciseData] = useState({});
  const [dataLoadind, setDataLoadind] = useState(true);
  useEffect(() => {
    axios
      .get("/api/dashboard", { timeout: 30000 })
      .then((res) => {
        if (res.data?.success) {
          setConciseData(res.data?.data);
          setDataLoadind(false);
        }
      })
      .catch((err) => {
        setDataLoadind(false);
        console.log("error on dashboard page: ", err);
      });
  }, []);
  if (status === "unauthenticated") {
    return redirect("/login");
  }
  if (status === "loading" || dataLoadind) {
    return "Loading...";
  }
  if (profileLoading) {
    return "Loading User Info ...";
  }
  if (!profileData.IsAdmin) {
    return "not An Admin";
  }
  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="mt-8 max-w-full mx-auto">
        <div className="flex flex-col gap-5 w-full">
          <h1 className="font-bold text-4xl mx-6 text-center">Dashboard</h1>
          <div className="mx-auto my-8">
            <div className="flex flex-col gap-5 w-full">
              <section
                className="grid grid-cols-1 gap-4 gap-x-8 transition-all 
              sm:grid-cols-2 lg:grid-cols-4"
              >
                <DashboardCard
                  label="Total Revenue"
                  amount={`$${(conciseDataforDivs?.totalRevenue ?? 0).toFixed(
                    2
                  )}`}
                  description="Total Revenue generated"
                  icon={LucideDollarSign}
                />
                <DashboardCard
                  label="Total Orders"
                  amount={`${
                    conciseDataforDivs?.totalPaidAndUnpaidOrders ?? 0
                  }`}
                  description="+11 Orders increase in this month"
                  icon={PersonStandingIcon}
                />
                <DashboardCard
                  label="Paid Orders"
                  amount={`${conciseDataforDivs?.totalPaidOrders ?? 0}`}
                  description="total paid order of this month"
                  icon={CreditCardIcon}
                />
                <DashboardCard
                  label="Sales"
                  amount={`+${conciseDataforDivs?.totalPaidOrders ?? 0}`}
                  description={`+${conciseDataforDivs?.totalPaidOrders ?? 0}
                   in this month, total sold items are ${
                     conciseDataforDivs?.totalPaidOrders ?? 0
                   }`}
                  icon={CircleCheckBig}
                />
              </section>
              <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
                <LineGraph userIcon={User2Icon} />
                <BarGraph userIcon={CandlestickChart} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
