"use client";

import axios from "axios";
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

export default function DashboardPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  if (status === "unauthenticated") {
    return redirect("/login");
  }
  if (status === "loading") {
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
                  label="Revenue"
                  amount="$2,000.00"
                  description="Total Revenue generated in this month"
                  icon={LucideDollarSign}
                />
                <DashboardCard
                  label="Customers"
                  amount="+250"
                  description="+22 customer increase in this month"
                  icon={PersonStandingIcon}
                />
                <DashboardCard
                  label="Profit"
                  amount="$500.00"
                  description="Profit of this month on the basis"
                  icon={CreditCardIcon}
                />
                <DashboardCard
                  label="Sales"
                  amount="+90"
                  description="+10 in this month total sold item are 90"
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
