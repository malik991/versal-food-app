"use client";
import { CartContext } from "@/app/context/authProvide";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartIcon, Bars3 } from "@/components/icons/Right";
export default function Header() {
  const session = useSession();
  const userData = session?.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }
  const [MobileMenu, setMobileMenu] = useState(false);

  function AuthNavigation({ userName, status }) {
    if (status === "authenticated") {
      return (
        <>
          <Link href={"/profile"} className="whitespace-nowrap">
            Hello, {userName}
          </Link>
          <button
            onClick={() => signOut()}
            className="bg-primary px-5 py-1 text-white rounded-full"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link href={"/login"} className="hover:text-primary">
            Login
          </Link>
          <Link
            href={"/register"}
            className="bg-primary px-5 py-1 text-white rounded-full"
          >
            Register
          </Link>
        </>
      );
    }
  }
  const { cartProducts } = useContext(CartContext);
  return (
    <header className="">
      <div className="flex items-center justify-between md:hidden">
        <nav className="flex items-center gap-3 text-gray-500 font-semibold">
          <Link className="text-primary font-semibold" href="/">
            Al-Rehman Pizza
          </Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <div className="flex gap-2 items-center">
            <div>
              <Link href={"/cart"} className="relative">
                <CartIcon clasName="w-4 h-4" />
                {cartProducts.length > 0 && (
                  <span
                    className="absolute text-xs -top-3 -right-3
           bg-primary text-white py-1 px-2 rounded-full leading-3"
                  >
                    {cartProducts.length}
                  </span>
                )}
              </Link>
            </div>
            <div>
              <button
                type="button"
                className="p-2 border-0"
                onClick={() => setMobileMenu(!MobileMenu)}
              >
                <Bars3 />
              </button>
            </div>
          </div>
        </nav>
      </div>
      {MobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="flex gap-2 justify-between items-center bg-gray-100 rounded-md mt-2 p-2 md:hidden"
        >
          <div className="flex flex-col gap-2 p-2">
            <Link
              href={"/"}
              className="hover:text-primary text-gray-600 font-semibold"
            >
              Home
            </Link>
            <Link
              href={"/menu"}
              className="hover:text-primary text-gray-600 font-semibold"
            >
              Menu
            </Link>
            <Link
              href={"/#about"}
              className="hover:text-primary text-gray-600 font-semibold"
            >
              About
            </Link>
            <Link
              href={"/#contact"}
              className="hover:text-primary text-gray-600 font-semibold"
            >
              Contact
            </Link>
          </div>
          <div className="flex gap-2 p-2 items-center">
            <AuthNavigation status={session?.status} userName={userName} />
          </div>
        </div>
      )}

      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-5 text-gray-500 font-semibold">
          <Link className="text-primary font-bold" href="/">
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
          <AuthNavigation userName={userName} status={session?.status} />

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
      </div>
    </header>
  );
}
