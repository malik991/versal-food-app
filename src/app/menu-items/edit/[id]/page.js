"use client";

import { useProfile } from "@/components/MyHooks/UseProfile";

import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import { LeftRoundedArow } from "@/components/icons/Right";
import { redirect, useParams, useRouter } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";
import DeleteButton from "@/components/layout/DeleteButton";
import { useSession } from "next-auth/react";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const { loading, data } = useProfile();
  const [menuItems, setMenuItems] = useState(null);
  const [redirectToMainMenu, setRedirectToMaainMenu] = useState(false);
  const route = useRouter();
  const session = useSession();
  const { status } = session;

  useEffect(() => {
    axios.get("/api/menu-item").then((items) => {
      const item = items.data?.data?.find((i) => i._id === id);
      if (item) {
        // console.log(item);
        setMenuItems(item);
      }
    });
  }, []);

  if (status === "unauthenticated") {
    return redirect("/login");
  }

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

  async function handleDeleteAction() {
    //ev.preventDefault();
    const result = axios.delete("/api/menu-item?_id=" + id);
    toast.promise(
      result,
      {
        loading: "Deleting Item ...",
        success: (res) => {
          if (res?.data?.success === true) {
            setRedirectToMaainMenu(true);
            return "Item deleted";
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
        {menuItems && (
          <>
            <MenuItemForm onSubmit={handleItemSubmit} menuItem={menuItems} />
            <div
              className="block sm:grid sm:grid-col-2 items-start gap-2 mt-2"
              style={{ gridTemplateColumns: ".3fr .7fr" }}
            >
              <div></div>
              <div>
                <DeleteButton
                  btnLabel={"Delete"}
                  onDelete={handleDeleteAction}
                />
                {/* <button type="button" onClick={handleDeleteAction}>
              Delete
            </button> */}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
