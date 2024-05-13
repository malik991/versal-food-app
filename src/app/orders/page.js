"use client";
import { useProfile } from "@/components/MyHooks/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import DateTimeFormate from "@/components/MyHooks/DateTime";
import Link from "next/link";

export default function MainOrderPage() {
  const { data: profileData, loading: profileLoading } = useProfile();
  const session = useSession();
  const { status } = session;
  const [orders, setOrders] = useState([]);
  const [loadingOrder, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/order")
      .then((res) => {
        if (res.data?.success) {
          setOrders(res.data?.data.reverse());
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("error in order page. ", err);
        setLoading(false);
      });
  }, []);
  if (status === "loading") {
    return "Loading...";
  }
  if (status === "unauthenticated") {
    return redirect("/login");
  }
  if (profileLoading) {
    return "Loading User Info ...";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={profileData.IsAdmin} />
      {loadingOrder && <div className="mt-8">orders loading ...</div>}
      <div className="mt-8">
        {/* <div className="bg-gray-100 rounded-lg p-4 mb-2 grid grid-cols-3 text-center">
          <div className="font-bold text-xl">Email</div>
          <div className="font-bold text-xl">Payment Status</div>
          <div className="font-bold text-xl">Order Date</div>
        </div> */}

        {orders?.length > 0 &&
          orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-gray-100 rounded-lg p-4 mb-2 flex items-center gap-6"
            >
              <div className=" grow flex gap-4 items-center">
                <div className="w-24">
                  <span
                    className={`${
                      order.paid ? "bg-green-500" : "bg-red-500"
                    } text-white font-bold px-3 py-2 rounded-md text-center`}
                  >
                    {order.paid ? "Paid" : "Not Paid"}
                  </span>
                </div>
                <div className="grow items-center">
                  <div className="flex gap-2 items-center">
                    <div className="grow">
                      <span>{order.userEmail}</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      <span>{DateTimeFormate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts?.length > 0 &&
                      order.cartProducts
                        .map((product) => product.name)
                        .join(", ")}
                  </div>
                </div>
              </div>
              <div>
                <Link
                  href={"/orders/" + order._id}
                  className="button"
                  target="_blank"
                >
                  show order
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
