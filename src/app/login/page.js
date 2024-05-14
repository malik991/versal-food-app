"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage(req) {
  const [isLoginUser, setIsLoginUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const handleLogin = async (ev) => {
    ev.preventDefault();
    if (!email || !password) {
      alert("please enter email and password");
    }
    try {
      setError(false);
      setIsLoginUser(true);
      // here we will use next-auth endpoint
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
      // bcz auth-next login credential provide accespt username instead of email
      setIsLoginUser(false);
    } catch (error) {
      setIsLoginUser(false);
      setError(true);
    }
  };
  return (
    <section className="my-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      {error && (
        <div className="my-4 text-red-500 text-md text-center">
          An Error has occured
          <br />
          please try again later.
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleLogin}>
        <input
          disabled={isLoginUser}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          disabled={isLoginUser}
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit" disabled={isLoginUser}>
          {isLoginUser ? "please wait" : "Login"}
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with Google
        </div>
        <button
          type="button"
          className="flex gap-4 justify-center"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image
            src={"/google.png"}
            alt={""}
            width={24}
            height={24}
            style={{ width: "24px", height: "24px" }}
          />
          Login with Google
        </button>
      </form>
      <div className="text-center my-4 text-gray-500  pt-4">
        Do not Have An Account?{" "}
        <Link className="underline" href={"/register"}>
          Register here &raquo;
        </Link>
      </div>
    </section>
  );
}
