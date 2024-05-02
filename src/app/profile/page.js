"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserTabs from "../../components/layout/UserTabs";
import UserForm from "@/components/layout/userForm";

export default function ProfilePage() {
  const session = useSession();

  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [data, setData] = useState(null);

  //const userImage = session.data?.user?.image;
  const { status } = session;

  useEffect(() => {
    if (session.status === "authenticated") {
      // setUsername(session.data?.user?.name);
      // setUserImage(session.data?.user?.image);
      axios
        .get("/api/profile")
        .then((response) => {
          setData(response.data);
          setIsAdmin(response.data.IsAdmin);
          setProfileFetched(true);
        })
        .catch((error) => {
          console.log("Error fetching profile data:", error);
        });
    }
  }, [session, status]);

  if (status === "unauthenticated") {
    return redirect("/login");
  }
  if (status === "loading" || !profileFetched) {
    return "Loading...";
  }

  const handleProfileInfoupdate = async (ev, data) => {
    ev.preventDefault();
    if (!data.name) {
      toast.error("name is mendatory");
      return;
    }
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await axios.put("/api/profile", {
          data,
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

  return (
    <section className="my-8">
      <UserTabs isAdmin={isAdmin} />
      <div className="max-w-md mx-auto mt-6">
        {/* {error && <ErrorBox> Error, Try Again!</ErrorBox>} */}
        <UserForm user={data} onSave={handleProfileInfoupdate} />
      </div>
    </section>
  );
}
