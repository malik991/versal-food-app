"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const session = useSession();
  const [userName, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [mobile, setMobile] = useState("");
  const [Street, setStreet] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  //const userImage = session.data?.user?.image;
  const { status } = session;

  useEffect(() => {
    if (session.status === "authenticated") {
      setUsername(session.data?.user?.name);
      setUserImage(session.data?.user?.image);
      axios
        .get("/api/profile")
        .then((response) => {
          setMobile(response.data.mobile);
          setStreet(response.data.Street);
          setPostCode(response.data.postCode);
          setCountry(response.data.country);
          setCity(response.data.city);
        })
        .catch((error) => {
          console.log("Error fetching profile data:", error);
        });
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
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await axios.put("/api/profile", {
          name: userName,
          mobile,
          Street,
          postCode,
          city,
          country,
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
    } catch (error) {
      console.log("errro in update profile infor: ", error);
    }
  };

  async function handleImageFile(ev) {
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
            success: `Uploaded!, please refresh`,
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
      } catch (error) {
        console.log("error in uploading avatar: ", error);
      }
    }
  }

  return (
    <section className="my-8">
      <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
      <div className="max-w-md mx-auto">
        {/* {error && <ErrorBox> Error, Try Again!</ErrorBox>} */}
        <div className="flex gap-1">
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
            <label>Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="first and last name"
            />
            <label>Email</label>
            <input
              type="email"
              disabled={true}
              value={session.data?.user?.email}
              placeholder="first and last name"
            />
            <label>Mobile</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+123456"
            />
            <label>Street Address</label>
            <input
              type="text"
              value={Street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street address"
            />
            <div className="flex gap-2">
              <div>
                <label>Postal Code</label>
                <input
                  type="text"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
            </div>
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </section>
  );
}
