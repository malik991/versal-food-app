"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();

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
    <section className="mt-8 max-w-md mx-auto ">
      <UserTabs isAdmin={true} />
    </section>
  );
}
