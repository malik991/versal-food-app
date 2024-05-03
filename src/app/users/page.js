"use client";
import { useProfile } from "@/components/MyHooks/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Users() {
  const { loading, data } = useProfile();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users").then((response) => {
      if (response.data) {
        setUsers(response.data?.data);
      }
    });
  }, []);

  if (loading) {
    return "Loading User Info...";
  }
  if (!data.IsAdmin) {
    return "Not an Admin";
  }
  return (
    <section className="mt-8">
      <div className="mt-8 max-w-xl mx-auto">
        <UserTabs isAdmin={true} />
        <div className="mt-8">
          {users?.length > 0 &&
            users.map((user) => (
              <div className="bg-gray-200 items-center rounded-md mb-2 p-2 flex gap-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 grow">
                  {user?.name?.includes(" ")
                    ? (user.name = user.name.split(" ")[0])
                    : null}
                  {!!user?.name && <span>{user.name}</span>}
                  {!user?.name && (
                    <span className="italic text-gray-500 font-semibold">
                      {"No Name"}
                    </span>
                  )}
                  <span>{user.email}</span>
                </div>
                <div>
                  <Link className="button" href={"/users/" + user._id}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
