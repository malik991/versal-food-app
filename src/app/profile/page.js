"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const session = useSession();
  const [userName, setUsername] = useState(session.data?.user?.name || "");
  const router = useRouter();
  const userImage = session.data?.user?.image;
  const { status } = session;
  if (status === "unauthenticated") {
    router.replace("/login");
  }
  if (status === "loading") {
    return "Loading...";
  }

  const handleProfileInfoupdate = async (ev) => {
    ev.preventDefault();
    try {
      const response = await axios.put("/api/profile", {
        name: userName,
      });
    } catch (error) {
      console.log("errro in update profile infor: ", error);
    }
  };

  return (
    <section className="my-8">
      <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
      <div className="max-w-md mx-auto">
        <div className="flex gap-2 items-center">
          <div className=" p-3">
            <div className="flex flex-col gap-2">
              <Image
                className="rounded-full w-full h-full"
                src={userImage}
                alt="avatar"
                width={250}
                height={250}
              />

              <button type="button">update</button>
            </div>
          </div>

          <form className="grow" onSubmit={handleProfileInfoupdate}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="first and last name"
            />
            <input
              type="email"
              disabled={true}
              value={session.data?.user?.email}
              placeholder="first and last name"
            />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </section>
  );
}
