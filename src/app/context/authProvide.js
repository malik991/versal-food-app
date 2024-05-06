"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(prodctFromCart) {
  let initialPrice = prodctFromCart.basePrice;
  if (prodctFromCart.size) {
    initialPrice += prodctFromCart.size.price;
  }
  if (prodctFromCart.extras.length > 0) {
    for (const extra of prodctFromCart.extras) {
      initialPrice += extra.price;
    }
  }
  return initialPrice;
}

export default function AuthProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  // if window available than use loca storage other wise null
  const localStorage =
    typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (localStorage && localStorage.getItem("cart")) {
      setCartProducts(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  // save cart into local storage
  function saveProductsofCartToLocalStorage(storInLocal) {
    if (localStorage) {
      localStorage.setItem("cart", JSON.stringify(storInLocal));
    }
  }
  function addToCart(product, size = null, extras = []) {
    setCartProducts((prevProduct) => {
      const inCartProduct = { ...product, size, extras };
      const newProduct = [...prevProduct, inCartProduct];
      saveProductsofCartToLocalStorage(newProduct);
      return newProduct;
    });
  }
  // remove produc from cart
  function removeProduct(indexToRemove) {
    setCartProducts((prevProduct) => {
      const updatedCartProducts = prevProduct.filter(
        (v, index) => index !== indexToRemove
      );
      saveProductsofCartToLocalStorage(updatedCartProducts);

      return updatedCartProducts;
    });
    toast.success("product removed");
  }
  // clear cart
  function clearCart() {
    setCartProducts([]);
    saveProductsofCartToLocalStorage([]);
  }

  return (
    <SessionProvider>
      <CartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          clearCart,
          removeProduct,
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
