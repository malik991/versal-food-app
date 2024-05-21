"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingUser, setIscreatingUser] = useState(false);
  const session = useSession();
  const { status } = session;
  if (status === "loading") {
    return "Loading ...";
  }
  if (status === "authenticated") {
    return redirect("/");
  }

  const handleRegisterSubmit = async (ev) => {
    if (!email || !password) {
      return alert("email and password is mendatory");
    }
    ev.preventDefault();
    try {
      setIscreatingUser(true);
      const res = await axios.post("/api/register", {
        email,
        password,
      });
      setIscreatingUser(false);
    } catch (error) {
      console.log("error in registering user: ", error);
      setIscreatingUser(false);
    }
  };
  return (
    <section className="my-8">
      <h1 className="text-center text-primary text-4xl mb-4">Register</h1>
      <form className="block max-w-xs mx-auto" onSubmit={handleRegisterSubmit}>
        <input
          disabled={isCreatingUser}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          disabled={isCreatingUser}
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit" disabled={isCreatingUser}>
          {isCreatingUser ? "please wait" : "Register"}
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
            alt={"google icon"}
            width={24}
            height={24}
            style={{ width: "24px", height: "24px" }}
          />
          Login with Google
        </button>
      </form>
    </section>
  );
}
