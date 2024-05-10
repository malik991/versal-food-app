"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/authProvide";
import Image from "next/image";
import { Trash } from "@/components/icons/Right";
import { cartProductPrice } from "../context/authProvide";
import AddressInput from "@/components/layout/addressInput";
import { useProfile } from "@/components/MyHooks/UseProfile";
import axios from "axios";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartProducts, removeProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();
  let subTotal = 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location?.href?.includes("canceled=1")) {
        toast.error("payment failed 😞");
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { mobile, Street, postCode, city, country } = profileData;
      const filterData = { mobile, Street, postCode, city, country };
      setAddress(filterData);
    }
  }, [profileData]);

  function handleChangeAddress(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  async function handleToProceedCheckout(ev) {
    //get address and cartproduct
    ev.preventDefault();
    // call api
    const data = { address, cartProducts };
    const result = axios.post("/api/checkout", data);
    toast.promise(
      result,
      {
        loading: "please wait ...",
        success: (res) => {
          if (res?.data?.success === true) {
            const link = res.data?.link;
            window.location = link;
            return "Redirect to Payment Method";
          } else {
            throw new Error(res?.data?.message);
          }
        },
        error: (err) => {
          if (
            err.response &&
            err.response.data &&
            !err.response?.data?.message
          ) {
            return `Error: ${err.response.data.message}`;
          } else if (err.message) {
            return `please try again, ${err.message}`;
          } else {
            return "An error occurred while redirect to payment.";
          }
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
          position: "top-right",
        },
        success: {
          duration: 5000,
          icon: "🔥",
        },
      }
    );

    // redirect to stripe
  }

  const calculateTotalPrice = () => {
    subTotal = cartProducts.reduce((total, product) => {
      return total + cartProductPrice(product);
    }, 0);
    return subTotal;
  };

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders header={"Cart"} />
        <p className="mt-4"> Oops! your shopping cart is empty 🙄</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders header={"Cart"} />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="my-4">
          {cartProducts?.length === 0 && (
            <span>you do not have any product in your soping cart</span>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <div
                key={index}
                className="flex gap-4 mb-2 border-b py-2 items-center"
              >
                <div className="w-24">
                  <Image src={product.image} alt="" width={240} height={240} />
                </div>
                <div className="grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.size && (
                    <div className="text-sm text-gray-700">
                      <span>size: {product.size.name}</span>
                    </div>
                  )}
                  {product.extras?.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {product.extras.map((extra) => (
                        <div>
                          <span className="text-gray-500">
                            {extra.name}: ${extra.price},
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="font-semibold text-lg mr-2">
                  ${cartProductPrice(product)}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="p-2"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          {/* Display total price */}
          <div className="text-right pr-10 text-gray-500 mt-2 ">
            SubTotal:{" "}
            <span className="font-semibold text-lg text-gray-800 pl-2">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>
          <div
            className="text-right text-gray-500 "
            style={{ paddingRight: "4.7rem" }}
          >
            Delivery:{" "}
            <span className="font-semibold text-lg text-gray-800 pl-2">$5</span>
          </div>
          <div className="text-right mr-10 text-gray-500 mt-2">
            Total:{" "}
            <span className="font-semibold text-lg text-gray-800 pl-2">
              ${(subTotal + 5).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="my-4 bg-gray-100 rounded-lg p-4">
          <span className="text-center mb-3 font-semibold text-primary">
            <h3>CheckOut</h3>
          </span>
          <form onSubmit={handleToProceedCheckout}>
            <AddressInput
              addressProps={address}
              setAddressProp={handleChangeAddress}
            />
            <button type="submit">Pay ${subTotal + 5}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
