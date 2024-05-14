"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import Link from "next/link";
import Right from "@/components/icons/Right";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchAllMenu();
  }, []);

  async function fetchAllMenu() {
    try {
      const response = await axios.get("/api/menu-item");
      if (response?.data?.success === true) {
        //console.log("res: ", response.data?.data);
        setMenuItems(response.data.data);
      } else {
        throw new Error(
          response?.data?.message || "An error occurred while loading the menu."
        );
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
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
      <div className=" mt-8 max-w-md mx-auto">
        <div className="mt-8 ">
          <Link className="button" href={"/menu-items/newItem"}>
            Create New Item
            <Right />
          </Link>
        </div>
        <div>
          <h2 className="text-sm text-gray-500 mt-8">Edit Menu Item:</h2>
          <div className="grid grid-cols-3 gap-2">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <Link
                  key={item._id}
                  href={`/menu-items/edit/${item._id}`}
                  className="bg-gray-200 rounded-lg p-3 text-center
                 hover:bg-white transition-all hover:shadow-md hover:shadow-black/30"
                >
                  <div className="relative mb-1">
                    <Image
                      className="rounded-md"
                      src={item.image}
                      alt="menu-item"
                      width={200}
                      height={200}
                      priority={true}
                    />
                  </div>
                  <div className="text-center">{item.name}</div>
                </Link>
              ))
            ) : (
              <div> no menu found</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
