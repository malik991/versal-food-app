"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { ErrorBox } from "@/components/layout/ErrroBox";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const session = useSession();
  const [userName, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [error, setError] = useState(false);
  const [btnDisabled, setbtnDisabled] = useState(false);

  const [disableImagebtn, setDisableImagebtn] = useState(false);

  //const userImage = session.data?.user?.image;
  const { status } = session;

  useEffect(() => {
    if (session.status === "authenticated") {
      setUsername(session.data?.user?.name);
      setUserImage(session.data?.user?.image);
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
      setError(false);
      setbtnDisabled(true);
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await axios.put("/api/profile", {
          name: userName,
        });
        if (response.data.success === true) {
          resolve();
        } else {
          reject();
        }
      });

      toast.promise(
        savingPromise,
        {
          loading: "Saving Wait ...",
          success: `Profile Update!`,
          error: `Error, please try Again`,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 5000,
            icon: "🔥",
          },
        }
      );

      setbtnDisabled(false);
    } catch (error) {
      console.log("errro in update profile infor: ", error);
      setError(true);
      setbtnDisabled(false);
    }
  };

  async function handleImageFile(ev) {
    setError(false);
    setDisableImagebtn(true);
    const getFiles = ev.target.files;
    if (getFiles?.length === 1) {
      const data = new FormData();
      data.set("file", getFiles[0]);
      try {
        const savingPromise = new Promise(async (resolve, reject) => {
          const response = await axios.post("/api/uploadAvatar", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success === true) {
            resolve();
          } else {
            reject();
          }
        });
        toast.promise(
          savingPromise,
          {
            loading: "Avatar upLoading ...",
            success: `Uploaded Successfully!`,
            error: `Error, please try Again`,
          },
          {
            style: {
              minWidth: "250px",
            },
            success: {
              duration: 5000,
              icon: "🔥",
            },
          }
        );

        setDisableImagebtn(false);
      } catch (error) {
        console.log("error in uploading avatar: ", error);
        setError(true);
        setDisableImagebtn(false);
      }
    }
  }

  return (
    <section className="my-8">
      <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
      <div className="max-w-md mx-auto">
        {error && <ErrorBox> Error, Try Again!</ErrorBox>}
        <div className="flex gap-2 items-center mt-3">
          <div className="">
            <div className="p-2 rounded-lg relative max-w-[120px]">
              <Image
                className="rounded-full w-full h-full mb-2"
                src={userImage}
                alt="avatar"
                width={250}
                height={250}
              />
              <label>
                <input
                  disabled={disableImagebtn}
                  type="file"
                  className="hidden"
                  onChange={handleImageFile}
                />
                <span
                  className="block text-center p-2 border border-gray-300 
                rounded-lg cursor-pointer hover:bg-primary"
                >
                  {disableImagebtn ? "Wait.." : "Update"}
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
