"use client";
import { useProfile } from "@/components/MyHooks/UseProfile";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import { LeftRoundedArow } from "@/components/icons/Right";
import { useRouter } from "next/navigation";
import MenuItemForm from "../../../components/layout/MenuItemForm";

export default function NewMenuItemPage() {
  const { loading, data } = useProfile();
  const [redirectToMainMenu, setRedirectToMaainMenu] = useState(false);
  const route = useRouter();

  if (loading) {
    return "Loading User Info...";
  }
  if (!data.IsAdmin) {
    return "Not an Admin";
  }

  async function handleItemSubmit(ev, data) {
    ev.preventDefault();
    if (!data.name) {
      toast.error("name is mendatory");
      return;
    }
    const result = axios.post("/api/menu-item", {
      data,
    });
    toast.promise(
      result,
      {
        loading: "Saving this tasty Item ...",
        success: (res) => {
          if (res?.data?.success === true) {
            setRedirectToMaainMenu(true);
            return "New Item Saved";
          } else {
            throw new Error(res?.data?.message);
          }
        },
        error: (err) => {
          if (
            err.response &&
            err.response.data &&
            !err.response?.data?.message
          ) {
            return `Error: ${err.response.data.message}`;
          } else if (err.message) {
            return `please try again, ${err.message}`;
          } else {
            return "An error occurred while saving the menu item.";
          }
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
          position: "top-right",
        },
        success: {
          duration: 5000,
          icon: "🔥",
        },
      }
    );
  }

  if (redirectToMainMenu) {
    route.replace("/menu-items");
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="mt-8 max-w-md mx-auto">
        <Link className="button" href={"/menu-items"}>
          <LeftRoundedArow />
          <span>Show All Menu</span>
        </Link>
      </div>
      <div className="max-w-md mx-auto mt-8">
        <MenuItemForm onSubmit={handleItemSubmit} />
      </div>
    </section>
  );
}
