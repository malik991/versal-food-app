"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
export default function Header() {
  const session = useSession();
  const userData = session?.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }
  return (
    <header className="flex items-center justify-between">
      <nav className="flex items-center gap-5 text-gray-500 font-semibold">
        <Link className="text-primary font-bold" href="">
          Al-Rehman Pizza
        </Link>

        <Link href={"/"} className="hover:text-primary">
          Home
        </Link>
        <Link href={"/"} className="hover:text-primary">
          Menu
        </Link>
        <Link href={"/"} className="hover:text-primary">
          About
        </Link>
        <Link href={"/"} className="hover:text-primary">
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
      </nav>
    </header>
  );
}
