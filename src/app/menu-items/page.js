"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import EditableImage from "@/components/layout/EditableImage";
import { resolve } from "path";
import { rejects } from "assert";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     axios
  //       .get("/api/menu-item-pic")
  //       .then((response) => {
  //         setmenueImage(response?.data?.data?.image);
  //       })
  //       .catch((err) => {
  //         console.log("Error fetching menue item data:", err);
  //       });
  //   }
  // }, [session, status]);

  async function handleItemSubmit(ev) {
    ev.preventDefault();
    console.log("name: ", name, " ImageURL: ", image);
    const result = axios.post("/api/menu-item", {
      name,
      description,
      basePrice,
    });
    toast.promise(
      result,
      {
        loading: "Saving this tasty Item ...",
        success: (res) => {
          if (res?.data?.success === true) {
            return "Menu Saved";
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

  if (status === "unauthenticated") {
    return redirect("/login");
  }
  if (status === "loading") {
    return "Loading...";
  }
  if (profileLoading) {
    return "Loading User Info ...";
  }
  if (!profileData.IsAdmin) {
    return "not An Admin";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-md mx-auto mt-6">
        <div
          className="grid items-start gap-2"
          style={{ gridTemplateColumns: ".3fr .7fr" }}
        >
          <div className="p-2 rounded-lg relative max-w-[120px]">
            <EditableImage link={image} findRoute={"item"} setLink={setImage} />
          </div>
          <form onSubmit={handleItemSubmit}>
            <div className="flex gap-3 items-start">
              <div className="grow">
                <label>Item name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="new item name"
                />
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  placeholder="Description"
                />
                <label>Base price</label>
                <input
                  type="text"
                  value={basePrice}
                  onChange={(ev) => setBasePrice(ev.target.value)}
                  placeholder="Base price"
                />
                <button type="submit" className="mt-3">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
