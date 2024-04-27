"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  const [categoryname, setCategoryname] = useState("");
  const [fetchAllcategories, setFetchAllcategories] = useState();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios
      .get("/api/category")
      .then((response) => {
        //console.log(response.data[0].name);
        setFetchAllcategories(response.data);
      })
      .catch((error) => {
        console.log("error in useffect to fetch all categories", error);
      });
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

  async function handleSubmitCategory(ev) {
    ev.preventDefault();
    const data = { name: categoryname };
    if (editedCategory) {
      data._id = editedCategory._id;
    }
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = editedCategory
          ? await axios.put("/api/category", data)
          : await axios.post("/api/category", data);
        fetchCategories();
        setCategoryname("");
        setEditedCategory(null);
        if (response.data.success === true) {
          resolve();
        } else {
          reject();
        }
      });

      toast.promise(
        savingPromise,
        {
          loading: editedCategory
            ? "Updating category..."
            : "Creating your new category ...",
          success: editedCategory ? `category updated!` : `category Created!`,
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
      console.log("errro in add new category: ", error);
    }
  }

  return (
    <section className="mt-8 max-w-md mx-auto ">
      <UserTabs isAdmin={true} />

      <form className="mt-4" onSubmit={handleSubmitCategory}>
        <div className="flex items-end gap-2">
          <div className="grow">
            <label>
              {editedCategory
                ? `Update Category: ${editedCategory.name}`
                : "New Category Name"}
            </label>
            <input
              type="text"
              placeholder="category name"
              name="category"
              value={categoryname}
              onChange={(ev) => setCategoryname(ev.target.value)}
            />
          </div>
          <div className="pb-2">
            <button type="submit">
              {editedCategory ? `Update` : "Create"}
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="text-sm text-gray-500 mt-6">Edit Category</h2>
        {fetchAllcategories?.length > 0 &&
          fetchAllcategories.map((category) => (
            <button
              onClick={() => {
                setEditedCategory(category);
                setCategoryname(category.name);
              }}
              className="bg-gray-200 rounded-xl p-2 px-4 flex gap-1 cursor-pointer mb-1"
            >
              <span>{category.name}</span>
            </button>
          ))}
      </div>
    </section>
  );
}
