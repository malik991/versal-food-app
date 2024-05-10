"use client";
import { CartContext } from "@/app/context/authProvide";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";
import { CartIcon } from "@/components/icons/Right";
export default function Header() {
  const session = useSession();
  const userData = session?.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }
  const { cartProducts } = useContext(CartContext);
  return (
    <header className="flex items-center justify-between">
      <nav className="flex items-center gap-5 text-gray-500 font-semibold">
        <Link className="text-primary font-bold" href="">
          Al-Rehman Pizza
        </Link>

        <Link href={"/"} className="hover:text-primary">
          Home
        </Link>
        <Link href={"/menu"} className="hover:text-primary">
          Menu
        </Link>
        <Link href={"/#about"} className="hover:text-primary">
          About
        </Link>
        <Link href={"/#contact"} className="hover:text-primary">
          Contact
        </Link>
      </nav>
      <nav className="flex items-center gap-4 text-gray-500 font-semibold">
        {session.status === "authenticated" && (
          <>
            <Link href={"/profile"} className="whitespace-nowrap">
              Hello, {userName}
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-primary px-8 py-2 text-white rounded-full"
            >
              Logout
            </button>
          </>
        )}
        {session.status === "unauthenticated" && (
          <>
            <Link href={"/login"} className="hover:text-primary">
              Login
            </Link>
            <Link
              href={"/register"}
              className="bg-primary px-8 py-2 text-white rounded-full"
            >
              Register
            </Link>
          </>
        )}

        <Link href={"/cart"} className="relative">
          <CartIcon />
          {cartProducts.length > 0 && (
            <span
              className="absolute text-xs -top-3 -right-3
           bg-primary text-white py-1 px-2 rounded-full leading-3"
            >
              {cartProducts.length}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
