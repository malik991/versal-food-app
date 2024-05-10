"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/authProvide";
import { cartProductPrice } from "../../context/authProvide";
import axios from "axios";
import Image from "next/image";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [getOrder, setOrder] = useState({});
  let subTotal;
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
                if (res.data?.success === true) {
                  setOrder(res.data.data);
                }
              }
            })
            .catch((err) => {
              console.log("eror: ", err);
            });
        }
      }
    }
  }, []);

  function calculateTotalPrice() {
    subTotal = getOrder?.cartProducts.reduce((total, product) => {
      return total + cartProductPrice(product);
    }, 0);

    return subTotal;
  }

  return (
    <section className="my-8">
      <div className=" max-w-xl mx-auto text-center">
        <SectionHeaders header="Your Order  " />
        <div className="mt-8">
          <p>Thanks for your order</p>
          <p>We will call you when your order will be on the way</p>
        </div>
      </div>
      {getOrder?.cartProducts?.length > 0 && (
        <div className="max-w-md mx-auto mt-8 rounded-lg">
          <div className="pt-3">
            <h1 className="text-primary text-xl font-semibold text-center">
              Order detail
            </h1>
          </div>
          {getOrder?.cartProducts.map((product, index) => (
            <div
              key={index + product._id}
              className="flex gap-2 items-center p-4 border-b"
            >
              <div className="w-24">
                <Image
                  src={product.image}
                  alt="product image"
                  width={240}
                  height={240}
                />
              </div>
              <div className="grow">
                <h3 className="font-semibold text-sm">{product.name}</h3>
                {product.size && (
                  <div className="text-sm text-gray-700">
                    <span>size: {product.size.name}</span>
                  </div>
                )}
                {product.extras.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {product.extras.map((extra, index) => (
                      <div key={extra._id + index}>
                        <span>
                          {extra.name}: ${extra.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="font-semibold text-lg mr-4 ">
                ${cartProductPrice(product)}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-1 items-end mt-2 mr-2">
            <div>
              <span>subTotal: ${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <div className="mr-2">
              <span>deliver: $5.00</span>
            </div>
            <div>
              <span>Total: ${(5 + subTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
