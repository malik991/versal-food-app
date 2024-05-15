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
        {orders?.length > 0
          ? orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-100 rounded-lg p-4 mb-2 flex flex-col sm:flex-row items-center gap-6"
              >
                <div className=" grow flex flex-col sm:flex-row gap-6 items-center">
                  <div>
                    <span
                      className={`${
                        order.paid ? "bg-green-500" : "bg-red-500"
                      } text-white p-2 inline-block w-24 rounded-md text-center`}
                    >
                      {order.paid ? "Paid" : "Not Paid"}
                    </span>
                  </div>
                  <div className="grow items-center">
                    <div className="flex gap-2 items-center">
                      <div className="grow">
                        <span
                          className={order.userEmail ? "" : "italic underline"}
                        >
                          {order.userEmail
                            ? order.userEmail
                            : "email not provided"}
                        </span>
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
            ))
          : !loadingOrder && (
              <div className="text-center">
                <span className="text-primary font-semibold ">
                  you do not give any order yet
                </span>
              </div>
            )}
      </div>
    </section>
  );
}
