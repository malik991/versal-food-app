"use client";

import { useProfile } from "@/components/MyHooks/UseProfile";

import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import { LeftRoundedArow } from "@/components/icons/Right";
import { useParams, useRouter } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const { loading, data } = useProfile();
  const [menuItems, setMenuItems] = useState(null);
  const [redirectToMainMenu, setRedirectToMaainMenu] = useState(false);
  const route = useRouter();

  useEffect(() => {
    axios.get("/api/menu-item").then((items) => {
      const item = items.data?.data?.find((i) => i._id === id);
      if (item) {
        setMenuItems(item);
      }
    });
  }, []);

  if (loading) {
    return "Loading User Info...";
  }
  if (!data.IsAdmin) {
    return "Not an Admin";
  }

  async function handleItemSubmit(ev, data) {
    ev.preventDefault();
    if (!data?.name) {
      toast.error("all fields are mendatory");
      return;
    }
    const result = axios.put("/api/menu-item", {
      _id: id,
      data,
    });
    toast.promise(
      result,
      {
        loading: "update this tasty Item ...",
        success: (res) => {
          if (res?.data?.success === true) {
            setRedirectToMaainMenu(true);
            return "Item Updated";
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
        <MenuItemForm onSubmit={handleItemSubmit} menuItem={menuItems} />
      </div>
    </section>
  );
}
