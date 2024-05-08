"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/authProvide";
import Image from "next/image";
import { Trash } from "@/components/icons/Right";
import { cartProductPrice } from "../context/authProvide";
import AddressInput from "@/components/layout/addressInput";
import { useProfile } from "@/components/MyHooks/UseProfile";

export default function CartPage() {
  const { cartProducts, removeProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();

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

  const calculateTotalPrice = () => {
    return cartProducts.reduce((total, product) => {
      return total + cartProductPrice(product);
    }, 0);
  };

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
        </div>
        <div className="my-4 bg-gray-100 rounded-lg p-4">
          <span className="text-center mb-3 font-semibold text-primary">
            <h3>CheckOut</h3>
          </span>
          <form>
            <AddressInput
              addressProps={address}
              setAddressProp={handleChangeAddress}
            />
            <button type="submit">save</button>
          </form>
        </div>
      </div>
    </section>
  );
}
