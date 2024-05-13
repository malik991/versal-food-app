"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/authProvide";
import { cartProductPrice } from "../../context/authProvide";
import axios from "axios";
import CartProducts from "@/components/menu/CartProducts";
import AddressInput from "@/components/layout/addressInput";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [getOrder, setOrder] = useState({});
  const [loadingOrder, setLoading] = useState(false);
  const { data: profileData } = useProfile();
  const [address, setAddress] = useState({});
  const { id } = useParams();
  let subTotal;
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("clear-cart=1")) {
        clearCart();
      }
    }
    if (id) {
      setLoading(true);
      axios
        .get("/api/order?id=" + id)
        .then((res) => {
          if (res.data) {
            if (res.data?.success === true) {
              setOrder(res.data.data);
              const { mobile, Street, postCode, city, country } = res.data.data;
              const filterData = {
                mobile,
                Street,
                postCode,
                city,
                country,
              };
              setAddress(filterData);
              setLoading(false);
            }
          }
        })
        .catch((err) => {
          console.log("eror: ", err);
          setLoading(false);
        });
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
      {loadingOrder && (
        <div className="mt-8">
          <p>Loading Order ...</p>
        </div>
      )}
      {getOrder?.cartProducts?.length > 0 && (
        <div className=" max-w-2xl mx-auto grid sm:grid-cols-2 gap-4 mt-6">
          <div className="my-4">
            <div className="pt-3">
              <h1 className="text-primary text-xl font-semibold text-center">
                Order detail
              </h1>
            </div>
            {getOrder?.cartProducts.map((product, index) => (
              <CartProducts key={index} product={product} />
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
          <div className="my-4 bg-gray-100 rounded-lg p-4">
            <AddressInput addressProps={address} disable={true} />
          </div>
        </div>
      )}
    </section>
  );
}
