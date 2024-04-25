"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const session = useSession();
  const [userName, setUsername] = useState("");
  const [showStatus, setStatus] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [btnDisabled, setbtnDisabled] = useState(false);
  const userImage = session.data?.user?.image;
  const { status } = session;

  useEffect(() => {
    if (session.status === "authenticated") {
      setUsername(session.data?.user?.name);
    }
  }, [session, status]);
  if (status === "unauthenticated") {
    return redirect("/login");
  }
  if (status === "loading") {
    return "Loading...";
  }

  const handleProfileInfoupdate = async (ev) => {
    ev.preventDefault();
    try {
      setStatus(false);
      setError(false);
      setbtnDisabled(true);
      setSaving(true);
      const response = await axios.put("/api/profile", {
        name: userName,
      });
      if (response.data.success === true) {
        setStatus(true);
      } else {
        setStatus(false);
      }
      setbtnDisabled(false);
      setSaving(false);
    } catch (error) {
      console.log("errro in update profile infor: ", error);
      setError(true);
      setbtnDisabled(false);
      setSaving(false);
    }
  };

  async function handleImageFile(ev) {
    const getFiles = ev.target.files;
    console.log("getfile: ", getFiles[0].name);
    if (getFiles?.length === 1) {
      const data = new FormData();
      data.set("file", getFiles[0]);
      try {
        const response = await axios.post("/api/uploadAvatar", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.log("error in uploading avatar: ", error);
      }
    }
  }

  return (
    <section className="my-8">
      <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
      <div className="max-w-md mx-auto">
        {showStatus && (
          <h2 className="text-center bg-green-200 p-2 rounded-xl border-2 border-green-500">
            Profile updated!
          </h2>
        )}
        {error && (
          <h2 className="text-center bg-red-200 p-2 rounded-xl border-2 border-red-500">
            Error, Try Again!
          </h2>
        )}
        {saving && (
          <h2 className="text-center bg-blue-200 p-2 rounded-xl border-2 border-blue-500">
            saving ....
          </h2>
        )}
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
              <label>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageFile}
                />
                <span
                  className="block text-center p-2 border border-gray-300 
                rounded-lg cursor-pointer hover:bg-primary"
                >
                  Update
                </span>
              </label>
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
            <button disabled={btnDisabled} type="submit">
              {btnDisabled ? "please wait" : "Save"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
