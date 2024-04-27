"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import EditableImage from "@/components/layout/EditableImage";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  const [menueImage, setmenueImage] = useState("");

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
            <EditableImage userImage={menueImage} />
          </div>
          <form>
            <div className="flex gap-3 items-start">
              <div className="grow">
                <label>Item name</label>
                <input type="text" placeholder="new item name" />
                <label>Description</label>
                <input type="text" placeholder="Description" />
                <label>Base price</label>
                <input type="text" placeholder="Base price" />
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
