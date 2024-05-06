"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext } from "react";
import { CartContext } from "../context/authProvide";
import Image from "next/image";
import { Trash } from "@/components/icons/Right";
import { cartProductPrice } from "../context/authProvide";

export default function CartPage() {
  const { cartProducts, removeProduct } = useContext(CartContext);
  function handleDeleteProductFromCart(ev, indexProduct) {
    console.log(indexProduct);
  }
  return (
    <section className="mt-8 text-center">
      <div>
        <SectionHeaders header={"Cart"} />
      </div>
      <div className="grid grid-cols-2 gap-1 mt-4">
        <div className="my-4">
          {cartProducts?.length === 0 && (
            <span>you do not have any product in your soping cart</span>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <div
                key={index}
                className="flex gap-2 mb-2 border-b py-2 items-center"
              >
                <div className="w-24">
                  <Image src={product.image} alt="" width={240} height={240} />
                </div>
                <div className="grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.size && (
                    <div className="text-sm text-gray-500">
                      <span className="text-gray-700">
                        size: {product.size.name}
                      </span>
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
        </div>
        <div className="mt-4">right</div>
      </div>
    </section>
  );
}
