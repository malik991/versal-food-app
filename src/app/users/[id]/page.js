"use client";

import { useParams } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "@/components/layout/userForm";
import toast from "react-hot-toast";
import Link from "next/link";
import { LeftRoundedArow } from "@/components/icons/Right";

export default function userPage() {
  const { loading, data } = useProfile();
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/profile?id=" + id)
      .then((response) => {
        if (response.data) {
          setUserData(response.data.data);
        }
      })
      .catch((err) => {
        console.log("error while fetch spesific user: ", err);
      });
  }, []);

  if (loading) {
    return "Loading User Info...";
  }
  if (!data.IsAdmin) {
    return "Not an Admin";
  }

  async function handleSaveData(ev, data) {
    ev.preventDefault();
    if (!data.name) {
      toast.error("name is mendatory");
      return;
    }

    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await axios.put("/api/profile", {
          data,
          id,
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
      console.log("errro in update any user info: ", error);
    }
  }

  return (
    <section className="mt-8">
      <div className="max-w-xl mx-auto mt-8">
        <UserTabs isAdmin={true} />
        <div className="mt-8 max-w-sm mx-auto">
          <Link href={"/users"} className="button">
            <LeftRoundedArow />
            All Users
          </Link>
        </div>
        <div className="mt-8">
          <UserForm
            user={userData}
            onSave={handleSaveData}
            userIdIfExist={id}
          />
        </div>
      </div>
    </section>
  );
}
