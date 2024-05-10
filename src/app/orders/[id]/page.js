"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/authProvide";
import axios from "axios";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("clear-cart=1")) {
        clearCart();
        const getOrderId = window.location.href.split("/orders/")[1];
        const chkOrderId = getOrderId?.split("?")[0];
        if (chkOrderId) {
          axios
            .get("/api/order?id=" + chkOrderId)
            .then((res) => {
              if (res.data) {
                console.log(res.data);
              }
            })
            .catch((err) => {
              console.log("eror: ", err);
            });
        }
      }
    }
  }, []);

  return (
    <section className="my-8">
      <div className=" max-w-xl mx-auto text-center">
        <SectionHeaders header="Your Order  " />
        <div className="mt-8">
          <p>Thanks for your order</p>
          <p>We will call you when your order will be on the way</p>
        </div>
      </div>
    </section>
  );
}
