"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useProfile } from "@/components/MyHooks/UseProfile";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AddIcon, EditIcon } from "@/components/icons/Right";
import DeleteButton from "@/components/layout/DeleteButton";

export default function CategoriesPage() {
  const session = useSession();
  const { status } = session;
  const { loading: profileLoading, data: profileData } = useProfile();
  const [categoryname, setCategoryname] = useState("");
  const [fetchAllcategories, setFetchAllcategories] = useState([]);
  const [meneItems, setMenuItems] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  async function fetchCategories() {
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

  async function fetchMenuItems() {
    try {
      const response = await axios.get("/api/menu-item");
      if (response.data.success === true) {
        // console.log(response.data?.data);
        setMenuItems(response.data?.data);
      }
    } catch (error) {
      console.log("error while fetching menue data in category: ", error);
      toast.error("Error fetching menu items");
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
            duration: 3000,
            icon: "🔥",
          },
        }
      );
    } catch (error) {
      console.log("errro in add new category: ", error);
    }
  }

  async function handleDeleteCategory(idToDelete) {
    //ev.preventDefault();
    if (!idToDelete) {
      toast.error("Item Id not found");
      return;
    }

    const isUsed = meneItems.some((item) => item?.category === idToDelete);
    if (isUsed) {
      toast.error("this category is in used of a menue Item");
      return;
    }
    const response = axios.delete(`/api/category/${idToDelete}`);
    toast.promise(
      response,
      {
        loading: "Deleting this item ...",
        success: (res) => {
          if (res?.data?.success === true) {
            fetchCategories();
            return "Item Deleted Successfully!";
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
          duration: 3000,
          icon: "🔥",
        },
      }
    );
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />

      <div className="mt-8 max-w-md mx-auto ">
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
            <div className="flex gap-1 pb-2">
              <button type="submit" className="text-sm items-center">
                <AddIcon />
                {editedCategory ? `Update` : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(null);
                  setCategoryname("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        <div>
          <h2 className="text-sm text-gray-500 mt-6">Existing Categories</h2>
          {fetchAllcategories?.length > 0 &&
            fetchAllcategories.map((category) => (
              <div
                key={category._id}
                className="rounded-xl bg-gray-200 p-2 px-4 flex gap-1 mb-1 items-center"
              >
                <span className="grow">{category.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditedCategory(category);
                      setCategoryname(category.name);
                    }}
                  >
                    <span className="text-sm">Edit</span>
                    <EditIcon className="w-5 h-5" />
                  </button>

                  <DeleteButton
                    btnLabel={"Delete"}
                    onDelete={() => handleDeleteCategory(category._id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
